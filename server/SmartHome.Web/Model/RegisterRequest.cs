using System.ComponentModel.DataAnnotations;

namespace SmartHome.Web.Model;

public class RegisterRequest
{
    [Required]
    public required string Login { get; set; }

    [Required]
    public required string Password { get; set; }
}
