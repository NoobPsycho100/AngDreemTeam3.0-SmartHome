using Microsoft.AspNetCore.Mvc;
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

    public RoomsController(IAuthService authService, IRoomsService roomsService)
    {
        _authService = authService;
        _roomsService = roomsService;
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
}
