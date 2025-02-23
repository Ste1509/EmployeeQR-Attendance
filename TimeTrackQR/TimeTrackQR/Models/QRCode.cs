namespace TimeTrackQR.Models
{
    public class QRCode
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee? Employee { get; set; }
        public string Code { get; set; } // El código QR almacenado como texto
    }
}
