namespace Starter.Core.Models.Auth;

public class UserUpdateProfileDto
{
    [Required] public Guid Id { get; set; }
    [Required] public string UserName { get; set; }
    [Required] public string FirstName { get; set; }
    [Required] public string LastName { get; set; }
    public string PhoneNumber { get; set; }
    [Required] [EmailAddress] public string Email { get; set; }
}