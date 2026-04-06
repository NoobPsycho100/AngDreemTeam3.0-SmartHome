using System.ComponentModel.DataAnnotations;

namespace SmartHome.Web.Model.Login;

public class RegisterRequest
{
    [Required]
    public required string Login { get; set; }

    [Required]
    public required string Password { get; set; }
}
