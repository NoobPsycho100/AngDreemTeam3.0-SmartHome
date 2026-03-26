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
    private readonly ILoginService _loginService;
    private readonly IAuthService _authService;

    public AuthPermissionFilter(Permission permission, ILoginService loginService, IAuthService authService)
    {
        _permission = permission;
        _loginService = loginService;
        _authService = authService;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var currentUser = _authService.GetCurrentUser();
        if (string.IsNullOrEmpty(currentUser))
        {
            context.Result = new ForbidResult();
            return;
        }

        var currentPermissions = await _loginService.GetUserPermissions(currentUser);
        if (!currentPermissions.Contains(_permission))
        {
            context.Result = new ForbidResult();
        }
    }
}
