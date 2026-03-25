using SmartHome.Core.Domain.Enums;

namespace SmartHome.Core.Services;

public interface ILoginService
{
    public Task<bool> IsLoginFree(string login);

    public Task<bool> ValidateLogin(string login, string password);

    public Task<Role[]> GetUserRoles(string login);

    public Task<Permission[]> GetUserPermissions(string login);

    public Task Register(string login, string password, string? createdBy, params Role[] roles);
}
