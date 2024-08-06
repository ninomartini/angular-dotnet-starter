namespace Starter.Core.Entities;

public class UserRole : IdentityUserRole<Guid>
{
    public virtual Role Role { get; set; }
    public virtual User User { get; set; }
}
