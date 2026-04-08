using Microsoft.EntityFrameworkCore;
using SmartHome.Core.Domain.Devices;

namespace SmartHome.Data.Context;

public partial class ApplicationDbContext : DbContext
{
    public DbSet<RoomType> RoomTypes => Set<RoomType>();

    private void CreateRoomTypesSchema(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RoomType>()
            .HasKey(x => x.RoomTypeId);
        modelBuilder.Entity<RoomType>()
            .HasIndex(x => x.TypeName).IsUnique(true);
    }
    private void CreateRoomTypesData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RoomType>().HasData(
                  new RoomType { RoomTypeId = 1, TypeName = "Living Room", },
                  new RoomType { RoomTypeId = 2, TypeName = "Kitchen", },
                  new RoomType { RoomTypeId = 3, TypeName = "Bedroom", },
                  new RoomType { RoomTypeId = 4, TypeName = "Bathroom", }
        );
    }
}
