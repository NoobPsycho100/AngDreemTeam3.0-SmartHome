namespace SmartHome.Core.Domain.Enums;

public enum Permission
{
    [AllowedRoles(Role.Admin)]
    AdminPanel = -1,

    [AllowedRoles(Role.Admin)]
    RegisterAdmin = -2,

    [AllowedRoles(Role.User)]
    Dashboard = 1,

    [AllowedRoles(Role.User)]
    RoomsView = 2,

    [AllowedRoles(Role.User)]
    RoomsEdit = 3,

    [AllowedRoles(Role.User)]
    DevicesView = 4,

    [AllowedRoles(Role.User)]
    DevicesEdit = 5,

    [AllowedRoles(Role.User)]
    ScenesView = 6,

    [AllowedRoles(Role.User)]
    ScenesEdit = 7,

    [AllowedRoles(Role.User)]
    Automation = 8,

    [AllowedRoles(Role.User)]
    Energy = 9,
}
