using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using SmartHome.Core.Services;
using SmartHome.Data.Context;
using SmartHome.Data.Services;
using SmartHome.Web.Auth;
using SmartHome.Web.Model;
using SmartHome.Web.Validation.Login;

namespace SmartHome.Web;

public static class DI
{
    public static void RegisterCustomDependencies(this IServiceCollection services, ConfigurationManager config)
    {
        services.AddDbContext<UsersContext>(options => {
                options.UseSqlite("Data Source=..\\SmartHome.Data\\data\\smarthome.db");
            }
        );

        services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();

        services.Configure<AuthSettings>(config.GetSection("Auth"));

        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IAuthService, AuthService>();

        services.RegisterValidators();
    }

    private static void RegisterValidators(this IServiceCollection services)
    {
        services.AddScoped<IValidator<LoginRequest>, LoginValidator>();
        services.AddScoped<IValidator<RegisterRequest>, RegisterValidator>();
        services.AddScoped<IValidator<AdminRegisterRequest>, AdminRegisterValidator>();
    }
}
