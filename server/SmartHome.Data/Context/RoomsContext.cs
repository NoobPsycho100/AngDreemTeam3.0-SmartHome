using Microsoft.EntityFrameworkCore;
using SmartHome.Core.Domain;
using SmartHome.Core.Domain.Devices;

namespace SmartHome.Data.Context;

public partial class ApplicationDbContext : DbContext
{
    public DbSet<UserRoom> UserRooms => Set<UserRoom>();

    private void CreateRoomsSchema(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserRoom>()
            .HasKey(x => x.UserRoomId);
        modelBuilder.Entity<UserRoom>()
            .HasIndex(x => x.UserId).IsUnique(false);
        modelBuilder.Entity<UserRoom>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .HasPrincipalKey(x => x.UserId);
        modelBuilder.Entity<UserRoom>()
            .HasOne<RoomType>(x => x.RoomType)
            .WithMany()
            .HasForeignKey(x => x.RoomTypeId)
            .HasPrincipalKey(x => x.RoomTypeId);
    }
    private void CreateRoomsData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserRoom>().HasData(
                  new UserRoom { UserRoomId = 1, UserId = 2, RoomTypeId = 1, RoomName = "My Room", Comment = null, RoomSize = 16.2 },
                  new UserRoom { UserRoomId = 2, UserId = 2, RoomTypeId = 2, RoomName = "My Kitchen", Comment = null, RoomSize = 9.5 },
                  new UserRoom { UserRoomId = 3, UserId = 2, RoomTypeId = 3, RoomName = null, Comment = null, RoomSize = 16.5 },
                  new UserRoom { UserRoomId = 4, UserId = 2, RoomTypeId = 4, RoomName = null, Comment = null, RoomSize = 3.2 },
                  new UserRoom { UserRoomId = 5, UserId = 2, RoomTypeId = 4, RoomName = null, Comment = null, RoomSize = 1.5 }
        );
    }
}
