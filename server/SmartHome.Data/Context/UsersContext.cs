using Microsoft.EntityFrameworkCore;
using SmartHome.Core.Domain;
using SmartHome.Core.Domain.Enums;

namespace SmartHome.Data.Context;

public partial class ApplicationDbContext : DbContext
{
    public DbSet<User> Users => Set<User>();

    private void CreateUsersSchema(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasKey(x => x.UserId);
        modelBuilder.Entity<User>()
            .HasIndex(x => x.Login).IsUnique(true);
        modelBuilder.Entity<User>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .HasPrincipalKey(x => x.UserId);
    }

    private void CreateUsersData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasData(
                  new User
                  {
                      UserId = 1,
                      Login = "admin",
                      Password = "12345",
                      Roles = [Role.Admin],
                  },
                  new User
                  {
                      UserId = 2,
                      Login = "NoobPsycho",
                      Password = "123456",
                      Roles = [Role.User],
                  },
                  new User
                  {
                      UserId = 3,
                      Login = "NoobPsycho100",
                      Password = "123456",
                      Roles = [Role.Admin, Role.User],
                      CreatedBy = "admin",
                      CreatedByUserId = 1
                  }
        );
    }
}
