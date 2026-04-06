namespace SmartHome.Web.Model.Devices;

public class DeviceModel
{
    public long UserDeviceId { get; set; }

    public required long UserId { get; set; }

    public required long DeviceTypeId { get; set; }

    public required string DeviceType { get; set; }

    public required long UserRoomId { get; set; }

    public required string? RoomName { get; set; }

    public required string RoomType { get; set; }

    public required string? DeviceName { get; set; }

    public required string? Comment { get; set; }

    public required string? IndicatorColor { get; set; }
}
