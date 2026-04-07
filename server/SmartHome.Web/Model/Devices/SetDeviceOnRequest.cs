namespace SmartHome.Web.Model.Devices
{
    public class SetDeviceOnRequest
    {
        public long UserDeviceId { get; set; }

        public bool IsOn { get; set; }
    }
}
