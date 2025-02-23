using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TimeTrackQR.Migrations
{
    /// <inheritdoc />
    public partial class AddSalaryAndHoursWorkedToRegister : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeSchedules_Employees_EmployeeId",
                table: "EmployeeSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeSchedules_Schedules_ScheduleId",
                table: "EmployeeSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_Registers_Employees_EmployeeId",
                table: "Registers");

            migrationBuilder.AddColumn<double>(
                name: "HoursWorked",
                table: "Registers",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Salary",
                table: "Registers",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeSchedules_Employees_EmployeeId",
                table: "EmployeeSchedules",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeSchedules_Schedules_ScheduleId",
                table: "EmployeeSchedules",
                column: "ScheduleId",
                principalTable: "Schedules",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Registers_Employees_EmployeeId",
                table: "Registers",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeSchedules_Employees_EmployeeId",
                table: "EmployeeSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeSchedules_Schedules_ScheduleId",
                table: "EmployeeSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_Registers_Employees_EmployeeId",
                table: "Registers");

            migrationBuilder.DropColumn(
                name: "HoursWorked",
                table: "Registers");

            migrationBuilder.DropColumn(
                name: "Salary",
                table: "Registers");

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeSchedules_Employees_EmployeeId",
                table: "EmployeeSchedules",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeSchedules_Schedules_ScheduleId",
                table: "EmployeeSchedules",
                column: "ScheduleId",
                principalTable: "Schedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Registers_Employees_EmployeeId",
                table: "Registers",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
