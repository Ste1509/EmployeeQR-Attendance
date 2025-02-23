using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Win32;
using System.Text;
using TimeTrackQR.Models;

namespace TimeTrackQR.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RegistersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("register")]
        public async Task<ActionResult<object>> Register([FromQuery]string hash)
        {
            // Decodificar el hash para obtener el employeeId
            string decodedHash;
            try
            {
                var decodedBytes = Convert.FromBase64String(hash);
                decodedHash = Encoding.UTF8.GetString(decodedBytes);
            }
            catch (FormatException)
            {
                return Ok(new { warning = "Formato de hash inválido." });
            }

            Console.WriteLine($"Hash decodificado: {decodedHash}");

            if (!int.TryParse(decodedHash, out int employeeId))
            {
                return Ok(new { warning = "El hash no contiene un employeeId válido." });
            }

            var employee = await _context.Employees
                .Include(e => e.EmployeeSchedules)
                .ThenInclude(eh => eh.Schedule)
                .FirstOrDefaultAsync(e => e.Id == employeeId);

            if (employee == null)
            {

                return Ok(new { warning = "Empleado no encontrado." });
            }

            var now = DateTime.Now;
            var todaysDate = DateTime.Today;
            var currentSchedule = employee.EmployeeSchedules
                .Where(eh => eh.Schedule.Date.Date == todaysDate)
                .Select(eh => eh.Schedule)
                .FirstOrDefault();

            if(currentSchedule == null)
            {
                return Ok(new { warning = "No hay horario configurado para hoy." });
            }
            var inputEstablished = todaysDate.Add(currentSchedule.TimeEntry);
            var outputEstablished = todaysDate.Add(currentSchedule.DepartureTime);

            // Si el empleado puede salir al día siguiente
            if (outputEstablished < inputEstablished)
            {
                outputEstablished = outputEstablished.AddDays(1);
            }

            // Validar si ya existe un registro de entrada para este horario
            var existingCheckIn = await _context.Registers
                .FirstOrDefaultAsync(r => r.EmployeeId == employeeId
                                          && r.Date == todaysDate
                                          && r.CheckInTime != null);

            if (existingCheckIn != null)
            {
                return Ok(new { warning = "El empleado ya ha registrado su entrada para este horario." });
            }

            var lastRecord = await _context.Registers
                .Where(r => r.EmployeeId == employeeId)
                .OrderByDescending(r => r.Date)
                .ThenByDescending(r => r.CheckInTime)
                .FirstOrDefaultAsync();

            if (lastRecord == null || lastRecord.CheckOutTime != null)
            {
                // Registrar entrada
                await _context.Registers.AddAsync(new Register
                {
                    EmployeeId = employeeId,
                    Date = todaysDate,
                    CheckInTime = now
                });

                await _context.SaveChangesAsync();

                string warning = "Registrado exitosamente.";
                if (now > inputEstablished)
                {
                    warning = "Ha registrado su entrada después de la hora establecida.";
                }

                return Ok(new { warning });
            }
            else
            {
                // Registrar salida
                lastRecord.CheckOutTime = now;
                

                var hoursWorked = (lastRecord.CheckOutTime.Value - lastRecord.CheckInTime).TotalHours;
                lastRecord.HoursWorked = hoursWorked;
                var salary = hoursWorked * employee.HourlyWage;
                lastRecord.Salary = salary;
                await _context.SaveChangesAsync();

                string warning = null;
                if (now < inputEstablished)
                {
                    warning = "Ha registrado su salida antes de la hora establecida.";
                }

                return Ok(new { salary, warning });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Register>>> GetRegisters()
        {
            // Incluir la entidad Employee al consultar los registros
            var registers = await _context.Registers
                                          .Include(r => r.Employee)  // Incluir la relación con Employee
                                          .Include(r => r.Employee.EmployeeSchedules)
                                            .ThenInclude(es => es.Schedule)
                                          .ToListAsync();

            return registers;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Register>> GetRegister(int id)
        {
            var register = await _context.Registers.FindAsync(id);

            if (register == null)
            {
                return NotFound();
            }

            return register;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRegister(int id, Register register)
        {
            if (id != register.Id)
            {
                return BadRequest();
            }

            _context.Entry(register).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RegisterExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRegister(int id)
        {
            var register = await _context.Registers.FindAsync(id);
            if (register == null)
            {
                return NotFound();
            }

            _context.Registers.Remove(register);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RegisterExists(int id)
        {
            return _context.Registers.Any(e => e.Id == id);
        }
        // Otros métodos...
    }

}
