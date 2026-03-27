using System.Text.Json.Serialization;

namespace SmartHome.Core.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Role
{
    Unknown = 0,
    User = 1,
    Admin = 2,
}
