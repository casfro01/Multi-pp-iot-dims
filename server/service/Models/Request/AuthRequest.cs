using System.ComponentModel.DataAnnotations;

namespace service.Models.Request;

public record RegisterRequest(
    [Required] string UserName,
    [Required] [MinLength(6)] string Password
);

public record LoginRequest([Required] string UserName, [Required] string Password);