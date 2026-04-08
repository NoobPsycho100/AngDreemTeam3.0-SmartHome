using SmartHome.Core.Domain.Devices;

namespace SmartHome.Core.Services;

public interface IRoomTypesService
{
    public Task<List<RoomType>> GetRoomTypes();

    public Task AddRoomType(string typeName);

    public Task UpdateRoomType(long typeId, string typeName);
}
