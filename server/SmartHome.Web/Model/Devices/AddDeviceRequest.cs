namespace SmartHome.Web.Model.Devices
{
    public class AddDeviceRequest
    {
        public required long DeviceTypeId { get; set; }

        public required long UserRoomId { get; set; }

        public required string? DeviceName { get; set; }

        public required string? Comment { get; set; }

        public required string? IndicatorColor { get; set; }

        public required string? DeviceIcon { get; set; }

        public required string[] CustomTags { get; set; }

        public required bool IsOn { get; set; }
    }
}
