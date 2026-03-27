using SmartHome.Core.Domain.Enums;

namespace SmartHome.Web.Model;

public class AdminRegisterRequest: RegisterRequest
{
    public Role[] Roles { get; set; } = [];
}
