using SmartHome.Core.Domain.Devices;

namespace SmartHome.Core.Services;

public interface IDeviceTypesService
{
    public Task<List<DeviceType>> GetDeviceTypes();

    public Task AddDeviceType(string typeName);

    public Task UpdateDeviceType(long typeId, string typeName);
}
