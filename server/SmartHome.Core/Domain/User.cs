using SmartHome.Core.Domain.Enums;

namespace SmartHome.Core.Domain;

public class User
{
    public long UserId { get; set; }

    public required string Login { get; set; }
    
    public required string Password { get; set; }
    
    public required Role[] Roles { get; set; }

    public string? CreatedBy { get; set; }

    public long? CreatedByUserId { get; set; }
}
