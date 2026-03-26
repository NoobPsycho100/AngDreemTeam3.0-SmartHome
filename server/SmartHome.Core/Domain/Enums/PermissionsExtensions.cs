using System.Reflection;

namespace SmartHome.Core.Domain.Enums;

public class AllowedRolesAttribute: Attribute
{
    public Role[] Roles { get; }

    public AllowedRolesAttribute(params Role[] roles)
    {
        Roles = roles;
    }
}

public static class PermissionsExtensions
{
    public static Role[] GetAllowedRoles(this Permission permission)
    {
        return permission.GetType()
            .GetMember(permission.ToString())[0]
            .GetCustomAttributes<AllowedRolesAttribute>()
            .SelectMany(x => x.Roles)
            .ToArray();
    }

    public static Permission[] GetRolePermissions(this Role role)
    {
        var allPermissions = Enum.GetValues<Permission>();
        return allPermissions.Where(x => x.GetAllowedRoles().Contains(role))
            .ToArray();
    }

    public static Permission[] GetRolesPermissions(this IEnumerable<Role> roles)
    {
        return roles.SelectMany(r => r.GetRolePermissions()).Distinct().ToArray();
    }
}
