using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QRCoder;
using System.Text;
using TimeTrackQR.Models;
using System.Security.Cryptography;


namespace TimeTrackQR.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QRCodesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public QRCodesController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("generate")]
        public async Task<ActionResult<QRCode>> GenerateQRCode(int employeeId)
        {
            var employee = await _context.Employees.FindAsync(employeeId);
            if (employee == null)
            {
                return NotFound("Empleado no encontrado.");
            }

            var baseUrl = _configuration["BaseUrl"]; // Obtener la URL base desde la configuración
            var employeeIdString = employeeId.ToString();
            var hashedContent = Convert.ToBase64String(Encoding.UTF8.GetBytes(employeeIdString));
            var qrCodeEntry = new QRCode
            {
                EmployeeId = employeeId,
                Code = $"{baseUrl}/api/registers/register?hash={hashedContent}" //localhost:3000/register/MQ==
            };
            _context.QRCodes.Add(qrCodeEntry);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetQRCodeByEmployeeId), new { id = qrCodeEntry.Id }, qrCodeEntry);
        }

        // Rest of the controller...


        [HttpGet]
        public async Task<ActionResult<IEnumerable<QRCode>>> GetQRCodes()
        {
            return await _context.QRCodes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<QRCode>> GetQRCodeByEmployeeId(int id)
        {
            var qrCode = await _context.QRCodes
                                       .FirstOrDefaultAsync(qr => qr.EmployeeId == id);
                                      

            if (qrCode == null)
            {
                return null;
            }

            return Ok(qrCode);
        }

        [HttpPost]
        public async Task<ActionResult<QRCode>> CreateQRCode(QRCode qrCode)
        {
            _context.QRCodes.Add(qrCode);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQRCodeByEmployeeId), new { id = qrCode.Id }, qrCode);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQRCode(int id, QRCode qrCode)
        {
            if (id != qrCode.Id)
            {
                return BadRequest();
            }

            _context.Entry(qrCode).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QRCodeExists(id))
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
        public async Task<IActionResult> DeleteQRCode(int id)
        {
            var qrCode = await _context.QRCodes.FindAsync(id);
            if (qrCode == null)
            {
                return NotFound();
            }

            _context.QRCodes.Remove(qrCode);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool QRCodeExists(int id)
        {
            return _context.QRCodes.Any(e => e.Id == id);
        }
    }

}
