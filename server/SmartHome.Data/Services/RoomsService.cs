using Microsoft.EntityFrameworkCore;
using SmartHome.Core.Domain.Devices;
using SmartHome.Core.Services;
using SmartHome.Data.Context;

namespace SmartHome.Data.Services;

public class RoomsService : IRoomsService
{
    private readonly ApplicationDbContext _context;

    public RoomsService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserRoom>> GetUserRooms(long userId)
    {
        return await _context.UserRooms
            .Include(r => r.RoomType)
            .Where(x => x.UserId == userId)
            .ToListAsync();
    }

    public async Task AddUserRoom(long userId, UserRoom room)
    {
        room.UserId = userId;
        await _context.UserRooms.AddAsync(room);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateUserRoom(long userId, long roomId, UserRoom room)
    {
        var userRoom = await _context.UserRooms.SingleAsync(x => x.UserId == userId && x.UserRoomId == roomId);
        userRoom.UserId = room.UserId;
        userRoom.RoomTypeId = room.RoomTypeId;
        userRoom.RoomType = room.RoomType;
        userRoom.RoomName = room.RoomName;
        userRoom.Comment = room.Comment;
        userRoom.RoomSize = room.RoomSize;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteUserRoom(long userId, long roomId)
    {
        var userRoom = await _context.UserRooms.SingleAsync(x => x.UserId == userId && x.UserRoomId == roomId);
        _context.UserRooms.Remove(userRoom);

        await _context.SaveChangesAsync();
    }
}
