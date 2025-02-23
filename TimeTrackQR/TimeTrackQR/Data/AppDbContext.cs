using Microsoft.EntityFrameworkCore;
using Microsoft.Win32;
using System.Collections.Generic;
using TimeTrackQR.Models;

namespace TimeTrackQR;

public class AppDbContext : DbContext
{
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Register> Registers { get; set; }
    public DbSet<QRCode> QRCodes { get; set; }
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<EmployeeSchedule> EmployeeSchedules { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<Register>()
            .HasOne(r => r.Employee)  // Un Register tiene un Employee
            .WithMany(e => e.Registers)  // Un Employee tiene muchos Registers
            .HasForeignKey(r => r.EmployeeId)  // Clave foránea en Register
            .IsRequired(false);

        modelBuilder.Entity<EmployeeSchedule>()
            .HasKey(eh => new { eh.EmployeeId, eh.ScheduleId });

        modelBuilder.Entity<EmployeeSchedule>()
            .HasOne(eh => eh.Employee)
            .WithMany(e => e.EmployeeSchedules)
            .HasForeignKey(eh => eh.EmployeeId)
            .IsRequired(false);

        modelBuilder.Entity<EmployeeSchedule>()
            .HasOne(eh => eh.Schedule)
            .WithMany(h => h.EmployeeSchedules)
            .HasForeignKey(eh => eh.ScheduleId)
            .IsRequired(false);

        modelBuilder.Entity<Schedule>()
            .Property(e => e.Date)
            .HasConversion(
                v => v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        modelBuilder.Entity<Register>()
        .Property(e => e.Date)
        .HasConversion(
            v => v.ToUniversalTime(),
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        modelBuilder.Entity<Register>()
            .Property(e => e.CheckInTime)
            .HasConversion(
                v => v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        modelBuilder.Entity<Register>()
            .Property(e => e.CheckOutTime)
            .HasConversion(
                v => v.HasValue ? v.Value.ToUniversalTime() : (DateTime?)null,
                v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : (DateTime?)null);
    }

}
