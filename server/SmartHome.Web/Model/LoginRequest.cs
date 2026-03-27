using System.ComponentModel.DataAnnotations;

namespace SmartHome.Web.Model;

public class LoginRequest
{
    [Required]
    public string Login { get; set; }

    [Required]
    public string Password { get; set; }
}
