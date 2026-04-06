using SmartHome.Core.Domain.Devices;

namespace SmartHome.Core.Services;

public interface IDevicesService
{
    public Task<List<UserDevice>> GetUserDevices(long userId);

    public Task AddUserDevice(UserDevice device);

    public Task UpdateUserDevice(long roomId, UserDevice device);
}
