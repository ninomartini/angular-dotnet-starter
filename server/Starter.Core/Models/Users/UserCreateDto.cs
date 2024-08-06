namespace Starter.Core.Models.Users;

public class UserCreateDto
{
    [Required] public string UserName { get; set; }
    [Required] public string Password { get; set; }
    [Required] public string FirstName { get; set; }
    [Required] public string LastName { get; set; }
    [Required] [EmailAddress] public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string Roles { get; set; }
}