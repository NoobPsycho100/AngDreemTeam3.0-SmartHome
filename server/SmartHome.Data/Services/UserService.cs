using Microsoft.EntityFrameworkCore;
using SmartHome.Core.Domain;
using SmartHome.Core.Domain.Enums;
using SmartHome.Core.Services;
using SmartHome.Data.Context;

namespace SmartHome.Data.Services;

public class UserService: IUserService
{

    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> IsLoginFree(string login)
    {
        login = login.Trim();
        var user = await _context.Users
            .SingleOrDefaultAsync(x => x.Login.ToLower() == login.ToLower());

        return user == null;
    }

    public async Task<bool> ValidateLogin(string login, string password)
    {
        login = login.Trim();
        var user = await _context.Users
            .SingleOrDefaultAsync(x => x.Login.ToLower() == login.ToLower() && x.Password.ToLower() == password.ToLower());

        return user != null;
    }

    public async Task<User?> GetUserByLogin(string login)
    {
        login = login.Trim();
        var user = await _context.Users
            .SingleOrDefaultAsync(x => x.Login.ToLower() == login.ToLower());

        return user;
    }

    public async Task Register(string login, string password, string? createdBy, long? createdByUserId, params Role[] roles)
    {
        login = login.Trim();
        var newUser = new User
        {
            Login = login,
            Password = password,
            Roles = roles,
            CreatedBy = createdBy,
            CreatedByUserId = createdByUserId,
        };

        await _context.Users.AddAsync(newUser);
        await _context.SaveChangesAsync();
    }
}
