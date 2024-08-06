namespace Starter.Data;

public class Seed
{
    public static async Task SeedDefaultUsersAndRolesAsync(UserManager<User> userManager, RoleManager<Role> roleManager)
    {
        // default roles go here
        var roles = new List<Role>
        {
            new() { Name = "Administrator" },
            new() { Name = "Guest" }
        };

        foreach (var role in roles)
            if (await roleManager.FindByNameAsync(role.Name) == null)
                await roleManager.CreateAsync(role);

        if (await userManager.Users.AnyAsync()) return;

        var admin = new User
        {
            UserName = "admin",
            Email = "admin@your-domain.com",
            FirstName = "System",
            LastName = "Administrator"
        };

        await userManager.CreateAsync(admin, "P@ssw0rd");
        await userManager.AddToRolesAsync(admin, new[] { "Administrator" });
    }
}