using System.Threading;

namespace Starter.Api.Controllers;

public class EmailController : BaseApiController
{
    private readonly IEmailService _emailService;

    public EmailController(IEmailService emailService)
    {
        _emailService = emailService;
    }
    
    [HttpPost("send-email")]
    public async Task<IActionResult> SendMailAsync(EmailData emailData)
    {
        var result = await _emailService.SendAsync(emailData, new CancellationToken());

        if (result)
        {
            return StatusCode(StatusCodes.Status200OK, "Email successfully sent.");
        } 
        else
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occured. The Email was not sent.");
        }
    }
}