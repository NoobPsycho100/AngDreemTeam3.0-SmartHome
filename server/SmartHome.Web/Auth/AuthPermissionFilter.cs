using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using SmartHome.Core.Domain.Enums;
using SmartHome.Core.Services;

namespace SmartHome.Web.Auth;

public class AuthPermissionAttribute : TypeFilterAttribute
{
    public AuthPermissionAttribute(Permission permission) : base(typeof(AuthPermissionFilter))
    {
        Arguments = [permission];
    }
}

public class AuthPermissionFilter : IAsyncAuthorizationFilter
{
    readonly Permission _permission;
    private readonly IUserService _userService;
    private readonly IAuthService _authService;

    public AuthPermissionFilter(Permission permission, IUserService userService, IAuthService authService)
    {
        _permission = permission;
        _userService = userService;
        _authService = authService;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var currentLogin = _authService.GetCurrentLogin();
        if (string.IsNullOrEmpty(currentLogin))
        {
            context.Result = new ForbidResult();
            return;
        }

        var currentUser = await _userService.GetUserByLogin(currentLogin);
        if (currentUser == null)
        {
            context.Result = new ForbidResult();
            return;
        }

        var currentPermissions = currentUser.Roles.GetRolesPermissions();
        if (!currentPermissions.Contains(_permission))
        {
            context.Result = new ForbidResult();
        }
    }
}
