using SmartHome.Core.Domain.Devices;

namespace SmartHome.Web.Model.Rooms
{
    public class AddRoomRequest
    {
        public required long RoomTypeId { get; set; }

        public required string? RoomName { get; set; }

        public required string? Comment { get; set; }

        public required double? RoomSize { get; set; }
    }
}