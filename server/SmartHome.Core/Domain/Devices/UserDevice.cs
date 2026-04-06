namespace SmartHome.Core.Domain.Devices;

public class UserDevice
{
    public long UserDeviceId { get; set; }

    public required long UserId { get; set; }

    public required long DeviceTypeId { get; set; }

    public DeviceType DeviceType { get; set; }

    public required long UserRoomId { get; set; }

    public UserRoom UserRoom { get; set; }

    public required string? DeviceName { get; set; }

    public required string? Comment { get; set; }

    public required string? IndicatorColor { get; set; }

    // TODO: add tags
    //public List<string> CustomTags { get; set; }
}
