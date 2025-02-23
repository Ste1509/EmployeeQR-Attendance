using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TimeTrackQR.Models;

namespace TimeTrackQR.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchedulesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SchedulesController(AppDbContext context)
        {
            _context = context;
        }

        // Obtener todos los horarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetSchedules()
        {
            return await _context.Schedules.ToListAsync(); ;
        }

        // Crear un nuevo horario
        [HttpPost("create")]
        public async Task<ActionResult<Schedule>> CreateSchedule(Schedule schedule)
        {
            if (schedule == null)
            {
                return BadRequest("Schedule is null.");
            }

            _context.Schedules.Add(schedule);
            await _context.SaveChangesAsync();

            return Ok(schedule);
        }

        // Asignar empleados a un horario existente
        [HttpPost("{scheduleId}/employees")]
        public async Task<ActionResult> AssignEmployeesToSchedule(int scheduleId, [FromBody] List<int> employeeIds)
        {
            // Buscar el horario específico
            var schedule = await _context.Schedules
                                         .Include(s => s.EmployeeSchedules)
                                         .ThenInclude(es => es.Employee)
                                         .FirstOrDefaultAsync(s => s.Id == scheduleId);

            if (schedule == null)
            {
                return NotFound("Schedule not found.");
            }

            // Obtener la fecha del horario actual
            var scheduleDate = schedule.Date;

            // Buscar empleados por sus IDs
            var employees = await _context.Employees
                                          .Where(e => employeeIds.Contains(e.Id))
                                          .ToListAsync();

            if (employees == null || employees.Count == 0)
            {
                return BadRequest("Invalid employee IDs.");
            }

            // Verificar si los empleados ya están asignados a otro horario en la misma fecha
            foreach (var employee in employees)
            {
                var existingSchedulesOnSameDate = await _context.Schedules
                                                                .Include(s => s.EmployeeSchedules)
                                                                .Where(s => s.Date == scheduleDate
                                                                    && s.EmployeeSchedules.Any(es => es.EmployeeId == employee.Id))
                                                                .ToListAsync();

                if (existingSchedulesOnSameDate.Any())
                {
                    return Ok($"Employee {employee.Name} is already assigned to another schedule on {scheduleDate.ToShortDateString()}.");
                }
            }

            // Asignar empleados al horario si no están ya asignados a otro en la misma fecha
            foreach (var employee in employees)
            {
                var employeeSchedule = new EmployeeSchedule
                {
                    EmployeeId = employee.Id,
                    ScheduleId = schedule.Id
                };

                schedule.EmployeeSchedules.Add(employeeSchedule);
            }

            // Guardar los cambios
            await _context.SaveChangesAsync();

            return Ok("Employees assigned successfully.");
        }

        // Obtener un horario con sus empleados
        [HttpGet("{scheduleId}")]
        public async Task<ActionResult<Schedule>> GetScheduleWithEmployees(int scheduleId)
        {
            var schedule = await _context.Schedules.Include(s => s.EmployeeSchedules)
                                                   .ThenInclude(es => es.Employee)
                                                   .FirstOrDefaultAsync(s => s.Id == scheduleId);

            if (schedule == null)
            {
                return NotFound("Schedule not found.");
            }

            return schedule;
        }

        [HttpDelete("{scheduleId}/employees/{employeeId}")]
        public async Task<ActionResult> RemoveEmployeeFromSchedule(int scheduleId, int employeeId)
        {
            // Buscar el horario con sus asignaciones de empleados
            var schedule = await _context.Schedules
                                         .Include(s => s.EmployeeSchedules)
                                         .FirstOrDefaultAsync(s => s.Id == scheduleId);

            if (schedule == null)
            {
                return NotFound("Schedule not found");
            }

            // Buscar la asignación específica del empleado en el horario
            var employeeSchedule = schedule.EmployeeSchedules
                                           .FirstOrDefault(es => es.EmployeeId == employeeId);

            if (employeeSchedule == null)
            {
                return NotFound("The employee's assignment was not found for this schedule.");
            }

            // Eliminar la asignación del empleado al horario
            _context.EmployeeSchedules.Remove(employeeSchedule);

            // Guardar los cambios
            await _context.SaveChangesAsync();

            return Ok("Employee removed from schedule successfully.");
        }

        [HttpGet("available-schedules")]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetSchedulesByEmployee([FromQuery] int? employeeId)
        {
            // Obtener los horarios donde el empleado está registrado
            var schedulesWithEmployee = await _context.Schedules
                .Include(s => s.EmployeeSchedules)
                .Where(s => s.EmployeeSchedules.Any(es => es.EmployeeId == employeeId))
                .ToListAsync();

            // Verificar si el empleado ya está en más de dos horarios en la misma fecha
            var employeeSchedulesGroupedByDate = schedulesWithEmployee
                .GroupBy(s => s.Date)  // Agrupar los horarios por fecha
                .Where(g => g.Count() >= 2)  // Verificar si está en dos o más horarios
                .ToList();

            if (employeeSchedulesGroupedByDate.Any())
            {
                return BadRequest("The employee is already assigned to two or more schedules on the same date.");
            }

            // Obtener los horarios donde el empleado NO está registrado
            var availableSchedules = await _context.Schedules
                .Include(s => s.EmployeeSchedules)
                .Where(s => !s.EmployeeSchedules.Any(es => es.EmployeeId == employeeId))  // Excluir horarios donde está registrado
                .ToListAsync();

            if (availableSchedules == null || availableSchedules.Count == 0)
            {
                return NotFound("No available schedules found for this employee.");
            }

            return availableSchedules;
        }


    }

}
