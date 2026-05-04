using System.Security.Claims;
using service.Models.Request;
using service.Models.Responses;

namespace service.Abstractions;

public interface IAuthService
{
    Task<AuthUserInfo> Authenticate(LoginRequest request);
    Task<AuthUserInfo> Register(RegisterRequest request);
    
    Task<AuthUserInfo?> GetUserInfo(String id);
}