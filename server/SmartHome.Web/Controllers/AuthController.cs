using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartHome.Core.Domain.Enums;
using SmartHome.Core.Services;
using SmartHome.Web.Auth;
using SmartHome.Web.Model.Login;

namespace SmartHome.Web.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IUserService _userService;

    public AuthController(IAuthService authService, IUserService userService)
    {
        _authService = authService;
        _userService = userService;
    }

    [Route("check-login")]
    [HttpGet]
    public async Task<bool> IsLoginFree(string login)
    {
        return await _userService.IsLoginFree(login);
    }

    [Route("login")]
    [HttpPost]
    public async Task<ActionResult> Login([FromBody] LoginRequest request)
    {
        if (!await _userService.ValidateLogin(request.Login, request.Password))
            return Unauthorized();

        return await ReturnAuthToken(request.Login);
    }

    [Route("refresh")]
    [HttpPost]
    [Authorize]
    public async Task<ActionResult> RefreshToken()
    {
        var currentUser = _authService.GetCurrentLogin();
        if (string.IsNullOrEmpty(currentUser))
            return Unauthorized();

        return await ReturnAuthToken(currentUser);
    }

    [Route("register")]
    [HttpPost]
    public async Task<ActionResult> RegisterUser([FromBody] RegisterRequest request)
    {
        if (!await _userService.IsLoginFree(request.Login))
            return Unauthorized();

        await _userService.Register(request.Login, request.Password, _authService.GetCurrentLogin(), _authService.GetCurrentUserId(), Role.User);

        return await ReturnAuthToken(request.Login);
    }

    [Route("register-admin")]
    [HttpPost]
    [AuthPermission(Permission.RegisterAdmin)]
    public async Task<ActionResult> RegisterAdmin([FromBody] AdminRegisterRequest request)
    {
        if (!await _userService.IsLoginFree(request.Login))
            return Unauthorized();

        await _userService.Register(request.Login, request.Password, _authService.GetCurrentLogin(), _authService.GetCurrentUserId(), request.Roles);

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
