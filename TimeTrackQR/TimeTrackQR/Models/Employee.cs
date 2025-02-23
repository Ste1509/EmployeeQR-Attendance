using System.Text.Json.Serialization;

namespace TimeTrackQR.Models;

public class Employee
{
    public int Id { get; set; }
    public string Name { get; set; }
    public double HourlyWage { get; set; }
    public string Email { get; set; }

    [JsonIgnore]
    public ICollection<EmployeeSchedule>? EmployeeSchedules { get; set; }

    [JsonIgnore]
    public ICollection<Register>? Registers { get; set; } 
}
