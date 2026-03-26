using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartHome.Core.Domain.Enums;
using SmartHome.Core.Services;
using SmartHome.Web.Auth;
using SmartHome.Web.Model;

namespace SmartHome.Web.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILoginService _loginService;

    public AuthController(IAuthService authService, ILoginService loginService)
    {
        _authService = authService;
        _loginService = loginService;
    }

    [Route("check-login")]
    [HttpGet]
    public async Task<bool> IsLoginFree(string login)
    {
        return await _loginService.IsLoginFree(login);
    }

    [Route("login")]
    [HttpPost]
    public async Task<ActionResult> Login([FromBody] LoginReguest request)
    {
        if (!await _loginService.ValidateLogin(request.Login, request.Password))
            return Unauthorized();

        return await ReturnAuthToken(request.Login);
    }

    [Route("refresh")]
    [HttpPost]
    [Authorize]
    public async Task<ActionResult> RefreshToken()
    {
        var currentUser = _authService.GetCurrentUser();
        if (string.IsNullOrEmpty(currentUser))
            return Unauthorized();

        return await ReturnAuthToken(currentUser);
    }

    [Route("register")]
    [HttpPost]
    public async Task<ActionResult> RegisterUser([FromBody] RegisterReguest request)
    {
        if (!await _loginService.IsLoginFree(request.Login))
            return Unauthorized();

        await _loginService.Register(request.Login, request.Password, _authService.GetCurrentUser(), Role.User);

        return await ReturnAuthToken(request.Login);
    }

    [Route("register-admin")]
    [HttpPost]
    //[Authorize]
    [AuthPermission(Permission.RegisterAdmin)]
    public async Task<ActionResult> RegisterAdmin([FromBody] RegisterReguest request)
    {
        if (!await _loginService.IsLoginFree(request.Login))
            return Unauthorized();

        await _loginService.Register(request.Login, request.Password, _authService.GetCurrentUser(), Role.Admin);

        return await ReturnAuthToken(request.Login);
    }

    #region Helpers

    private async Task<ActionResult> ReturnAuthToken(string login)
    {
        var token = await _authService.GenerateToken(login);
        Response.Headers.Append("x-auth-token", token);
        Response.Headers.Append("Access-Control-Expose-Headers", "x-auth-token");
        
        return Accepted();
    }

    #endregion Helpers
}
