using Microsoft.EntityFrameworkCore;
using SmartHome.Core.Domain.Devices;

namespace SmartHome.Data.Context;

public partial class ApplicationDbContext : DbContext
{
    public DbSet<DeviceType> DeviceTypes => Set<DeviceType>();

    private void CreateDeviceTypesSchema(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DeviceType>()
            .HasKey(x => x.DeviceTypeId);
        modelBuilder.Entity<DeviceType>()
            .HasIndex(x => x.TypeName).IsUnique(true);
    }
    private void CreateDeviceTypesData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DeviceType>().HasData(
                  new DeviceType { DeviceTypeId = 1, TypeName = "Light", },
                  new DeviceType { DeviceTypeId = 2, TypeName = "Camera", },
                  new DeviceType { DeviceTypeId = 3, TypeName = "TV Set", },
                  new DeviceType { DeviceTypeId = 4, TypeName = "Fridge", }
        );
    }
}
