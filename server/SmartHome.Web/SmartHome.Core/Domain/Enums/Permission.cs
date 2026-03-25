namespace SmartHome.Core.Domain.Enums;

public enum Permission
{
    [AllowedRoles(Role.Admin)]
    AdminPanel = -1,

    [AllowedRoles(Role.Admin)]
    RegisterAdmin = -2,

    [AllowedRoles(Role.User)]
    Dashboard = 1,

    [AllowedRoles(Role.Admin, Role.User)]
    RoomsView = 2,

    [AllowedRoles(Role.Admin, Role.User)]
    RoomsEdit = 3,
}
