using System.Text.Json.Serialization;

namespace TimeTrackQR.Models
{
    public class Schedule
    {
        public int Id { get; set; }
        public DateTime Date { get; set; } // Fecha del horario
        public TimeSpan TimeEntry { get; set; }
        public TimeSpan DepartureTime { get; set; }

        [JsonIgnore]
        public ICollection<EmployeeSchedule>? EmployeeSchedules { get; set; } // Relación con empleados

    }
}
