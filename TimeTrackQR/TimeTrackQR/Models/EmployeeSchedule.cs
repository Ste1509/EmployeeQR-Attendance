namespace TimeTrackQR.Models
{
    public class EmployeeSchedule
    {
        public int EmployeeId { get; set; }
        public Employee? Employee { get; set; }

        public int ScheduleId { get; set; }
        public Schedule? Schedule { get; set; }
    }
}
