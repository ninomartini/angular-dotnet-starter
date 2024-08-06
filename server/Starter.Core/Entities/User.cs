﻿namespace Starter.Core.Entities;

public class User : IdentityUser<Guid>
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    
    public virtual ICollection<UserRole> UserRoles { get; set; }
}