namespace Starter.Core.Models.Auth;

public class ForgotPasswordDto
{
    [Required] [EmailAddress] public string Email { get; set; }
}