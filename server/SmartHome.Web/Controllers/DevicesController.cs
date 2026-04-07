using Microsoft.AspNetCore.Mvc;
using SmartHome.Core.Domain.Devices;
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
    private readonly IDeviceTypesService _deviceTypesService;

    public DevicesController(IAuthService authService, IDevicesService devicesService, IDeviceTypesService deviceTypesService)
    {
        _authService = authService;
        _devicesService = devicesService;
        _deviceTypesService = deviceTypesService;
    }

    [Route("device-types")]
    [HttpGet]
    public async Task<List<DeviceTypeModel>> GetDeviceTypes()
    {
        var devices = await _deviceTypesService.GetDeviceTypes();
        return devices.Select(x => new DeviceTypeModel
        {
            DeviceTypeId = x.DeviceTypeId,
            TypeName = x.TypeName,
        }).ToList();
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
            DeviceIcon = x.DeviceIcon,
            CustomTags = x.CustomTags.Split('|'),
            IsOn = x.IsOn,
        }).ToList();
    }

    [Route("set-on")]
    [HttpPost]
    [AuthPermission(Permission.DevicesView)]
    public async Task SetDeviceOn(SetDeviceOnRequest request)
    {
        var userId = _authService.GetCurrentUserId();
        if (userId == null)
            throw new UnauthorizedAccessException();

        await _devicesService.SetDeviceOn(userId.Value, request.UserDeviceId, request.IsOn);
    }

    [Route("update-device")]
    [HttpPost]
    [AuthPermission(Permission.DevicesEdit)]
    public async Task UpdateDevice(UpdateDeviceRequest request)
    {
        var userId = _authService.GetCurrentUserId();
        if (userId == null)
            throw new UnauthorizedAccessException();

        var device = new UserDevice
        {
            UserDeviceId = request.UserDeviceId,
            UserId = userId.Value,
            DeviceTypeId = request.DeviceTypeId,
            UserRoomId = request.UserRoomId,
            DeviceName = request.DeviceName,
            Comment = request.Comment,
            IndicatorColor = request.IndicatorColor,
            DeviceIcon = request.DeviceIcon,
            CustomTags = String.Join('|', request.CustomTags),
            IsOn = request.IsOn,
        };
        await _devicesService.UpdateUserDevice(userId.Value, request.UserDeviceId, device);
    }

    [Route("add-device")]
    [HttpPut]
    [AuthPermission(Permission.DevicesEdit)]
    public async Task AddDevice(AddDeviceRequest request)
    {
        var userId = _authService.GetCurrentUserId();
        if (userId == null)
            throw new UnauthorizedAccessException();

        var device = new UserDevice
        {
            UserId = userId.Value,
            DeviceTypeId = request.DeviceTypeId,
            UserRoomId = request.UserRoomId,
            DeviceName = request.DeviceName,
            Comment = request.Comment,
            IndicatorColor = request.IndicatorColor,
            DeviceIcon = request.DeviceIcon,
            CustomTags = String.Join('|', request.CustomTags),
            IsOn = request.IsOn,
        };
        await _devicesService.AddUserDevice(userId.Value, device);
    }
}
