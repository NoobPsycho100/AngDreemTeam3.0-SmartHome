namespace SmartHome.Web.Auth;

public interface IAuthService
{
    public string? GetCurrentLogin();
    public long? GetCurrentUserId();

    /// <summary>
    /// Generates Jwt Bearer token with login, roles and permissions
    /// </summary>
    public Task<string> GenerateToken(string login);
}
