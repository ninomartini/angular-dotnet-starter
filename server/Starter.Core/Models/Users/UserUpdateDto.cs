namespace Starter.Core.Models.Users;

public class UserUpdateDto
{
    public Guid Id { get; set; }
    [Required] public string UserName { get; set; }
    public string Password { get; set; }
    [Required] public string FirstName { get; set; }
    [Required] public string LastName { get; set; }
    [Required] [EmailAddress] public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string Roles { get; set; }
}