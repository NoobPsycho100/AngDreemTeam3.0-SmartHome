using Microsoft.EntityFrameworkCore;
using SmartHome.Core.Domain.Devices;
using SmartHome.Core.Services;
using SmartHome.Data.Context;

namespace SmartHome.Data.Services;

public class DevicesService: IDevicesService
{
    private readonly ApplicationDbContext _context;

    public DevicesService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserDevice>> GetUserDevices(long userId)
    {
        return await _context.UserDevices
            .Include(r => r.DeviceType)
            .Include(r => r.UserRoom)
            .Include(r => r.UserRoom.RoomType)
            .Where(x => x.UserId == userId)
            .ToListAsync();
    }

    public async Task AddUserDevice(long userId, UserDevice device)
    {
        device.UserId = userId;
        await _context.UserDevices.AddAsync(device);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateUserDevice(long userId, long deviceId, UserDevice device)
    {
        var userDevice = await _context.UserDevices.SingleAsync(x => x.UserId == userId && x.UserDeviceId == deviceId);
        userDevice.UserId = userId;
        userDevice.DeviceTypeId = device.DeviceTypeId;
        userDevice.DeviceType = device.DeviceType;
        userDevice.UserRoomId = device.UserRoomId;
        userDevice.UserRoom = device.UserRoom;
        userDevice.DeviceName = device.DeviceName;
        userDevice.Comment = device.Comment;
        userDevice.IndicatorColor = device.IndicatorColor;
        userDevice.DeviceIcon = device.DeviceIcon;
        userDevice.CustomTags = device.CustomTags;
        userDevice.IsOn = device.IsOn;

        await _context.SaveChangesAsync();
    }

    public async Task SetDeviceOn(long userId, long deviceId, bool isOn)
    {
        var userDevice = await _context.UserDevices.SingleAsync(x => x.UserId == userId && x.UserDeviceId == deviceId);
        userDevice.IsOn = isOn;

        await _context.SaveChangesAsync();
    }
}
