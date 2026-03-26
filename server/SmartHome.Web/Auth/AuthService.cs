using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SmartHome.Core.Services;

namespace SmartHome.Web.Auth;

public class AuthService: IAuthService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILoginService _loginService;
    private readonly IOptions<AuthSettings> _settings;
    private readonly SymmetricSecurityKey _key;

    public AuthService(IHttpContextAccessor httpContextAccessor, ILoginService loginService, IOptions<AuthSettings> settings)
    {
        _httpContextAccessor = httpContextAccessor;
        _loginService = loginService;
        _settings = settings;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Value.SecretKey));
    }

    public string? GetCurrentUser()
    {
        return _httpContextAccessor.HttpContext?.User.Claims.SingleOrDefault(x => x.Type == ClaimType.Login.ToString())?.Value;
    }

    public async Task<string> GenerateToken(string login)
    {
        var roles = await _loginService.GetUserRoles(login);
        var permissions = await _loginService.GetUserPermissions(login);

        var claims = new List<Claim>
        {
            new Claim(ClaimType.Login.ToString(), login),
            new Claim(ClaimType.Roles.ToString(), String.Join('|', roles)),
            new Claim(ClaimType.Permissions.ToString(), String.Join('|', permissions)),
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
