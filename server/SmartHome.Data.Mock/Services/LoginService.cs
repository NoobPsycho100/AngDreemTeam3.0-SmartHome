using SmartHome.Core.Domain;
using SmartHome.Core.Domain.Enums;
using SmartHome.Core.Services;
using SmartHome.Data.Mock.MockedData;

namespace SmartHome.Data.Mock.Services;

public class LoginService: ILoginService
{
    private readonly IMockedDataService _dataService;

    public LoginService(IMockedDataService dataService)
    {
        _dataService = dataService;
    }

    public async Task<bool> IsLoginFree(string login)
    {
        login = login.Trim();
        return (await FindUserByLogin(login)) == null;
    }

    public async Task<bool> ValidateLogin(string login, string password)
    {
        login = login.Trim();
        return (await FindUserByLoginAndPassword(login, password)) != null;
    }

    public async Task<Role[]> GetUserRoles(string login)
    {
        login = login.Trim();
        return (await FindUserByLogin(login)).Roles;
    }

    public async Task<Permission[]> GetUserPermissions(string login)
    {
        login = login.Trim();
        return (await FindUserByLogin(login)).Roles.GetRolesPermissions();
    }

    public async Task Register(string login, string password, string? createdBy, params Role[] roles)
    {
        login = login.Trim();
        var newUser = new User
        {
            Login = login,
            Password = password,
            Roles = roles,
            CreatedBy = createdBy,
        };
        await AddUser(newUser);
    }

    #region Mock Helpers

    private async Task<User?> FindUserByLogin(string login)
    {
        return (await _dataService.GetAllUsers())
            .SingleOrDefault(x => string.Equals(x.Login, login, StringComparison.InvariantCultureIgnoreCase));
    }

    private async Task<User?> FindUserByLoginAndPassword(string login, string password)
    {
        return (await _dataService.GetAllUsers())
            .SingleOrDefault(x => string.Equals(x.Login, login, StringComparison.InvariantCultureIgnoreCase)
                               && string.Equals(x.Password, password, StringComparison.InvariantCulture));
    }

    private async Task AddUser(User user)
    {
        var data = await _dataService.GetAllUsers();
        data.Add(user);
        await _dataService.SaveAllUsers(data);
    }

    #endregion Mock Helpers
}
