using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TimeTrackQR.Models;

namespace TimeTrackQR.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("{employeeId}/Schedules")]
        public async Task<ActionResult> AssignSchedule(int employeeId, [FromBody] int scheduleId)
        {
            var employee = await _context.Employees.FindAsync(employeeId);
            var schedule = await _context.Schedules.FindAsync(scheduleId);

            if (employee == null || schedule == null)
            {
                return NotFound("Empleado o horario no encontrado.");
            }

            var employeeSchedule = new EmployeeSchedule
            {
                EmployeeId = employeeId,
                ScheduleId = scheduleId
            };

            _context.EmployeeSchedules.Add(employeeSchedule);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            return await _context.Employees
                .Include(e => e.EmployeeSchedules)
                .ThenInclude(es => es.Schedule)  // Incluir también los horarios
                .ToListAsync();
        }

        [HttpPost("createSchedule")]
        public async Task<ActionResult<Schedule>> CreateSchedule(Schedule schedule)
        {
            _context.Schedules.Add(schedule);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSchedule), new { id = schedule.Id }, schedule);
        }

        [HttpGet("schedules/{id}")]
        public async Task<ActionResult<Schedule>> GetSchedule(int id)
        {
            var horario = await _context.Schedules.FindAsync(id);

            if (horario == null)
            {
                return NotFound();
            }

            return horario;
        }

        // GET: api/Employees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees
                .Include(e => e.EmployeeSchedules)
                .ThenInclude(es => es.Schedule)  // Incluir los horarios para este empleado
                .FirstOrDefaultAsync(e => e.Id == id);

            if (employee == null)
            {
                return NotFound();
            }

            return employee;
        }

        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee(Employee employee)
        {
            // Validación básica
            if (employee == null)
            {
                return BadRequest("El empleado no puede ser nulo.");
            }

            // Validación personalizada (ejemplo: validar email)
            if (string.IsNullOrEmpty(employee.Email) || !employee.Email.Contains("@"))
            {
                return BadRequest("El correo electrónico no es válido.");
            }

            // Agregar el nuevo empleado a la base de datos
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            // Devolver la respuesta con el objeto creado
            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }

        // Métodos adicionales para actualizar y eliminar empleados
    }

}
