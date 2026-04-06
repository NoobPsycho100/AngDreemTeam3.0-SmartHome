using SmartHome.Core.Domain.Devices;

namespace SmartHome.Core.Services;

public interface IRoomsService
{
    public Task<List<UserRoom>> GetUserRooms(long userId);

    public Task AddUserRoom(UserRoom room);

    public Task UpdateUserRoom(long roomId, UserRoom room);
}
