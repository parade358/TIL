using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FirstAPI
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly ILogger<ValuesController> _logger;

        public ValuesController(ILogger<ValuesController> logger)
        {
            _logger = logger;
        }

        [HttpPost("contacts")]
        public IActionResult AddContact([FromBody] Contact contact)
        {
            // 요청에서 받은 contact를 처리하는 로직을 작성합니다.
            // 예를 들어, 데이터베이스에 저장할 수 있습니다.
            _logger.LogInformation($"Received contact: Name={contact.Name}, PhoneNumber={contact.PhoneNumber}, Group={contact.Group}");

            return Ok(new { message = "Contact added successfully" });
        }
    }
    public class Contact
    {
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Group { get; set; }
    }
}
