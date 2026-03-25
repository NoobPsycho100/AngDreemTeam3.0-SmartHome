using SmartHome.Core.Domain.Enums;

namespace SmartHome.Core.Domain;

public class User
{
    public string Login { get; set; }
    public string Password { get; set; }
    public Role[] Roles { get; set; }

    public string? CreatedBy { get; set; }
}
