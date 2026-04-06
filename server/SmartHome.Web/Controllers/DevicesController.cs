using Microsoft.AspNetCore.Mvc;
using SmartHome.Core.Domain.Enums;
using SmartHome.Core.Services;
using SmartHome.Web.Auth;
using SmartHome.Web.Model.Devices;

namespace SmartHome.Web.Controllers;

[ApiController]
[Route("api/devices")]
public class DevicesController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IDevicesService _devicesService;

    public DevicesController(IAuthService authService, IDevicesService devicesService)
    {
        _authService = authService;
        _devicesService = devicesService;
    }

    [Route("my-devices")]
    [HttpGet]
    [AuthPermission(Permission.DevicesView)]
    public async Task<List<DeviceModel>> GetMyDevices()
    {
        var userId = _authService.GetCurrentUserId();
        if (userId == null)
            throw new UnauthorizedAccessException();

        var devices = await _devicesService.GetUserDevices(userId.Value);
        return devices.Select(x => new DeviceModel
        {
            UserDeviceId = x.UserDeviceId,
            UserId = x.UserId,
            DeviceTypeId = x.DeviceTypeId,
            DeviceType = x.DeviceType.TypeName,
            UserRoomId = x.UserRoomId,
            RoomName = x.UserRoom.RoomName,
            RoomType = x.UserRoom.RoomType.TypeName,
            DeviceName = x.DeviceName,
            Comment = x.Comment,
            IndicatorColor = x.IndicatorColor,
        }).ToList();
    }
}
