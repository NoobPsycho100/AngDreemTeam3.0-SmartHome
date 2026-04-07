using Microsoft.EntityFrameworkCore;
using SmartHome.Core.Domain;
using SmartHome.Core.Domain.Devices;

namespace SmartHome.Data.Context;

public partial class ApplicationDbContext : DbContext
{
    public DbSet<UserDevice> UserDevices => Set<UserDevice>();

    private void CreateDevicesSchema(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserDevice>()
            .HasKey(x => x.UserDeviceId);
        modelBuilder.Entity<UserDevice>()
            .HasIndex(x => new { x.UserId, x.UserRoomId }).IsUnique(false);
        modelBuilder.Entity<UserDevice>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .HasPrincipalKey(x => x.UserId);
        modelBuilder.Entity<UserDevice>()
            .HasOne<UserRoom>(x => x.UserRoom)
            .WithMany()
            .HasForeignKey(x => x.UserRoomId)
            .HasPrincipalKey(x => x.UserRoomId);
        modelBuilder.Entity<UserDevice>()
            .HasOne<DeviceType>(x => x.DeviceType)
            .WithMany()
            .HasForeignKey(x => x.DeviceTypeId)
            .HasPrincipalKey(x => x.DeviceTypeId);
    }
    private void CreateDevicesData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserDevice>().HasData(
                  new UserDevice { UserDeviceId = 1, UserId = 2, UserRoomId = 1, DeviceTypeId = 1, DeviceName = "Room Light", Comment = null, IndicatorColor = "red", },
                  new UserDevice { UserDeviceId = 2, UserId = 2, UserRoomId = 1, DeviceTypeId = 3, DeviceName = "Room TV", Comment = null, IndicatorColor = "blue", },
                  new UserDevice { UserDeviceId = 3, UserId = 2, UserRoomId = 1, DeviceTypeId = 1, DeviceName = null, Comment = null, IndicatorColor = null, },
                  new UserDevice { UserDeviceId = 4, UserId = 2, UserRoomId = 3, DeviceTypeId = 2, DeviceName = null, Comment = null, IndicatorColor = "green", },
                  new UserDevice { UserDeviceId = 5, UserId = 2, UserRoomId = 3, DeviceTypeId = 4, DeviceName = null, Comment = null, IndicatorColor = "blue", }
        );
    }
}
