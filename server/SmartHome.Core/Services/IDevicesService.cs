using SmartHome.Core.Domain.Devices;

namespace SmartHome.Core.Services;

public interface IDevicesService
{
    public Task<List<UserDevice>> GetUserDevices(long userId);

    public Task AddUserDevice(long userId, UserDevice device);

    public Task UpdateUserDevice(long userId, long deviceId, UserDevice device);

    public Task SetDeviceOn(long userId, long deviceId, bool isOn);
}
