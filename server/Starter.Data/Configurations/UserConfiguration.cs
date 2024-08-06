namespace Starter.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> entity)
    {
        entity.Property(e => e.FirstName)
            .HasMaxLength(100);

        entity.Property(e => e.LastName)
            .HasMaxLength(100);
    }
}