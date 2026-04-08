using SmartHome.Core.Domain;
using SmartHome.Core.Domain.Enums;

namespace SmartHome.Core.Services;

public interface IUserService
{
    public Task<bool> IsLoginFree(string login);

    public Task<bool> ValidateLogin(string login, string password);

    public Task<User?> GetUserByLogin(string login);

    public Task Register(string login, string password, string? createdBy, long? createdByUserId, params Role[] roles);
}
