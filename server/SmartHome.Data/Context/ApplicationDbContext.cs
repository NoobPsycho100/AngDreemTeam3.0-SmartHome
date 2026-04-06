using Microsoft.EntityFrameworkCore;

namespace SmartHome.Data.Context;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
        Database.EnsureCreated();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        this.CreateUsersSchema(modelBuilder);
        this.CreateRoomTypesSchema(modelBuilder);
        this.CreateRoomsSchema(modelBuilder);
        this.CreateDeviceTypesSchema(modelBuilder);
        this.CreateDevicesSchema(modelBuilder);

        this.CreateUsersData(modelBuilder);
        this.CreateRoomTypesData(modelBuilder);
        this.CreateRoomsData(modelBuilder);
        this.CreateDeviceTypesData(modelBuilder);
        this.CreateDevicesData(modelBuilder);
    }
}
