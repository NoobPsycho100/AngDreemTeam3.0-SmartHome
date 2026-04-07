using Microsoft.AspNetCore.Mvc;
using SmartHome.Core.Domain.Devices;
using SmartHome.Core.Domain.Enums;
using SmartHome.Core.Services;
using SmartHome.Web.Auth;
using SmartHome.Web.Model.Rooms;

namespace SmartHome.Web.Controllers;

[ApiController]
[Route("api/rooms")]
public class RoomsController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IRoomsService _roomsService;
    private readonly IRoomTypesService _roomTypesService;

    public RoomsController(IAuthService authService, IRoomsService roomsService, IRoomTypesService roomTypesService)
    {
        _authService = authService;
        _roomsService = roomsService;
        _roomTypesService = roomTypesService;
    }

    [Route("rooms-types")]
    [HttpGet]
    public async Task<List<RoomTypeModel>> GetRoomTypes()
    {
        var devices = await _roomTypesService.GetRoomTypes();
        return devices.Select(x => new RoomTypeModel
        {
            RoomTypeId = x.RoomTypeId,
            TypeName = x.TypeName,
        }).ToList();
    }

    [Route("my-rooms")]
    [HttpGet]
    [AuthPermission(Permission.RoomsView)]
    public async Task<List<RoomModel>> GetMyRooms()
    {
        var userId = _authService.GetCurrentUserId();
        if (userId == null)
            throw new UnauthorizedAccessException();

        var rooms = await _roomsService.GetUserRooms(userId.Value);
        return rooms.Select(x => new RoomModel
        {
            UserRoomId = x.UserRoomId,
            UserId = x.UserId,
            RoomTypeId = x.RoomTypeId,
            RoomType = x.RoomType.TypeName,
            RoomName = x.RoomName,
            Comment = x.Comment,
            RoomSize = x.RoomSize,
        }).ToList();
    }

    [Route("update-room")]
    [HttpPost]
    [AuthPermission(Permission.RoomsEdit)]
    public async Task UpdateDevice(UpdateRoomRequest request)
    {
        var userId = _authService.GetCurrentUserId();
        if (userId == null)
            throw new UnauthorizedAccessException();

        var room = new UserRoom
        {
            UserId = userId.Value,
            UserRoomId = request.UserRoomId,
            RoomTypeId = request.RoomTypeId,
            RoomName = request.RoomName,
            Comment = request.Comment,
            RoomSize = request.RoomSize,
        };
        await _roomsService.UpdateUserRoom(userId.Value, request.UserRoomId, room);
    }

    [Route("add-room")]
    [HttpPut]
    [AuthPermission(Permission.RoomsEdit)]
    public async Task AddDevice(AddRoomRequest request)
    {
        var userId = _authService.GetCurrentUserId();
        if (userId == null)
            throw new UnauthorizedAccessException();

        var room = new UserRoom
        {
            UserId = userId.Value,
            RoomTypeId = request.RoomTypeId,
            RoomName = request.RoomName,
            Comment = request.Comment,
            RoomSize = request.RoomSize,
        };
        await _roomsService.AddUserRoom(userId.Value, room);
    }

    [Route("delete-room")]
    [HttpDelete]
    [AuthPermission(Permission.RoomsEdit)]
    public async Task DeleteRoom(long userRoomId)
    {
        var userId = _authService.GetCurrentUserId();
        if (userId == null)
            throw new UnauthorizedAccessException();

        await _roomsService.DeleteUserRoom(userId.Value, userRoomId);
    }
}
