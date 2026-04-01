using Microsoft.EntityFrameworkCore;
using SmartHome.Core.Domain;
using SmartHome.Core.Domain.Enums;

namespace SmartHome.Data.Context;

public class UsersContext : DbContext
{
    public DbSet<User> Users => Set<User>();
    public UsersContext(DbContextOptions<UsersContext> options): base(options)
    {
        Database.EnsureCreated();
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasKey(x => x.Id);
        //modelBuilder.Entity<User>()
        //    .HasAlternateKey(x => x.Login);
        modelBuilder.Entity<User>()
            .HasIndex(x => x.Login).IsUnique(true);
        modelBuilder.Entity<User>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .HasPrincipalKey(x => x.Id);

        modelBuilder.Entity<User>().HasData(
                  new User
                  {
                      Id = 1,
                      Login = "admin",
                      Password = "12345",
                      Roles = [Role.Admin],
                  },
                  new User
                  {
                      Id = 2,
                      Login = "NoobPsycho",
                      Password = "123456",
                      Roles = [Role.User],
                  },
                  new User
                  {
                      Id = 3,
                      Login = "NoobPsycho100",
                      Password = "123456",
                      Roles = [Role.Admin, Role.User],
                      CreatedBy = "admin",
                      CreatedByUserId = 1
                  }
        );
    }
}
