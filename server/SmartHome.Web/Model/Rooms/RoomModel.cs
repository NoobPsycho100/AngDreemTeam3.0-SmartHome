
namespace SmartHome.Web.Model.Rooms;

public class RoomModel
{
    public long UserRoomId { get; set; }

    public required long UserId { get; set; }

    public required long RoomTypeId { get; set; }

    public required string RoomType { get; set; }

    public required string? RoomName { get; set; }

    public required string? Comment { get; set; }

    public required double? RoomSize { get; set; }
}
