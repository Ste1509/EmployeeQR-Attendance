namespace TimeTrackQR.Models;

public class Register
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public Employee? Employee { get; set; }
    public DateTime Date { get; set; }
    public DateTime CheckInTime { get; set; }
    public DateTime? CheckOutTime { get; set; }
    public double? HoursWorked { get; set; }
    public double? Salary { get; set; }

}
