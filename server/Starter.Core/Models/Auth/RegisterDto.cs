namespace Starter.Core.Models.Auth;

public class RegisterDto
{
    [Required] public string UserName { get; set; }
    [Required] [DataType(DataType.Password)] public string Password { get; set; }
    [Required] [EmailAddress] public string Email { get; set; }
    [Required] public string FirstName { get; set; }
    [Required] public string LastName { get; set; }
    [Required] public string PhoneNumber { get; set; }
}