namespace Starter.Core.Models.Auth;

public class ChangePasswordDto
{
    [Required] public string UserName { get; set; }
    [Required] public string CurrentPassword { get; set; }
    [Required] public string NewPassword { get; set; }
    [Required] public string ConfirmPassword { get; set; } 
}