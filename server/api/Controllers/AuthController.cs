using System.Runtime.ExceptionServices;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using service.Abstractions;
using service.Models.Responses;
using service.Security;
using service.Models.Request;
using StateleSSE.AspNetCore;

namespace api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService service, ITokenService tokenService) : ControllerBase
{
    [HttpPost]
    [Route("login")]
    [AllowAnonymous]
    public async Task<LoginResponse> Login([FromBody]LoginRequest request)
    {
        var userInfo = await service.Authenticate(request);
        var token = tokenService.CreateToken(userInfo);
        return new LoginResponse(token);
    }

    [HttpPost]
    [Route("register")]
    [AllowAnonymous]
    public async Task<RegisterResponse> Register([FromBody]RegisterRequest request)
    {
        var userInfo = await service.Register(request);
        return new RegisterResponse(UserName: userInfo.UserName);
    }

    [HttpPost]
    [Route("logout")]
    public async Task<IResult> Logout()
    {
        throw new NotImplementedException();
    }

    [HttpGet]
    [Route("userinfo")]
    public async Task<AuthUserInfo?> UserInfo()
    {
        var userID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return await service.GetUserInfo(userID);
    }
    
    [HttpPost(nameof(SetDisplayName))]
    [Authorize]
    public async Task<string> SetDisplayName([FromBody] SetDisplayNameRequest request)
    {
        var requestUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (requestUserId != null)
        {
            request.UserId = requestUserId;
            return "None";
        }

        string displayName = await service.SetDisplayName(request);
        return displayName;
    }
}