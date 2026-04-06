using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SmartHome.Core.Domain.Enums;
using SmartHome.Core.Services;

namespace SmartHome.Web.Auth;

public class AuthService: IAuthService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUserService _userService;
    private readonly IOptions<AuthSettings> _settings;
    private readonly SymmetricSecurityKey _key;

    public AuthService(IHttpContextAccessor httpContextAccessor, IUserService userService, IOptions<AuthSettings> settings)
    {
        _httpContextAccessor = httpContextAccessor;
        _userService = userService;
        _settings = settings;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Value.SecretKey));
    }

    public string? GetCurrentLogin()
    {
        return _httpContextAccessor.HttpContext?.User.Claims.SingleOrDefault(x => x.Type == ClaimType.Login.ToString())?.Value;
    }

    public long? GetCurrentUserId()
    {
        var userIdString = _httpContextAccessor.HttpContext?.User.Claims.SingleOrDefault(x => x.Type == ClaimType.UserId.ToString())?.Value;
        return userIdString != null && long.TryParse(userIdString, out var userId) ? userId : null;
    }

    public async Task<string> GenerateToken(string login)
    {
        var user = await _userService.GetUserByLogin(login);
        if (user == null)
            return string.Empty;

        var claims = new List<Claim>
        {
            new Claim(ClaimType.UserId.ToString(), user.UserId.ToString()),
            new Claim(ClaimType.Login.ToString(), login),
            new Claim(ClaimType.Roles.ToString(), String.Join('|', user.Roles)),
            new Claim(ClaimType.Permissions.ToString(), String.Join('|', user.Roles.GetRolesPermissions())),
        };

        var jwt = new JwtSecurityToken(
            issuer: _settings.Value.Issuer,
            audience: _settings.Value.Audience,
            claims: claims,
            expires: DateTime.UtcNow.Add(_settings.Value.Expiration),
            signingCredentials: new SigningCredentials(_key, SecurityAlgorithms.HmacSha256));

        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }
}
