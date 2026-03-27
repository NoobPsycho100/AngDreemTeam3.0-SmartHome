using FluentValidation;
using SmartHome.Core.Services;
using SmartHome.Web.Model;

namespace SmartHome.Web.Validation.Login;

public class RegisterValidator : AbstractValidator<RegisterRequest>
{
    private readonly ILoginService _loginService;

    public RegisterValidator(ILoginService loginService)
    {
        _loginService = loginService;

        RuleFor(x => x.Login).NotEmpty().WithMessage("Login field should not be empty");

        RuleFor(x => x.Password).NotEmpty().WithMessage("Password field should not be empty")
                                .MinimumLength(5).WithMessage("Password should be longer than 5 symbols");

        RuleFor(x => x.Login).MustAsync(async (x, cancellation) => string.IsNullOrEmpty(x) || await _loginService.IsLoginFree(x))
                             .WithMessage("Specified login is alredy taken");
    }
}
