using FluentValidation;
using SmartHome.Core.Services;
using SmartHome.Web.Model;

namespace SmartHome.Web.Validation.Login;

public class LoginValidator: AbstractValidator<LoginRequest>
{
    private readonly IUserService _userService;

    public LoginValidator(IUserService userService)
    {
        _userService = userService;

        RuleFor(x => x.Login).NotEmpty().WithMessage("Login field should not be empty");

        RuleFor(x => x.Password).NotEmpty().WithMessage("Password field should not be empty");

        RuleFor(x => x).MustAsync(async (x, cancellation) => string.IsNullOrEmpty(x.Login) || await _userService.ValidateLogin(x.Login, x.Password))
                       .WithName(nameof(LoginRequest.Login)).WithMessage("Incorrect login or password");
    }
}
