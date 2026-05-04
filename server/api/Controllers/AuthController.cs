using System.Runtime.ExceptionServices;
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
public class AuthController(IAuthService service, ITokenService tokenService, ISseBackplane backplane) : ControllerBase
{
    [HttpPost]
    [Route("login")]
    [AllowAnonymous]
    public async Task<LoginResponse> Login([FromBody] LoginRequest request)
    {
        var userInfo = service.Authenticate(request);
        var token = tokenService.CreateToken(userInfo);
        return new LoginResponse(token);
    }

    [HttpPost]
    [Route("register")]
    [AllowAnonymous]
    public async Task<RegisterResponse> Register([FromBody] RegisterRequest request)
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
        return service.GetUserInfo(User);
    }
    
    
    [HttpGet("sse")]
    public async Task Connect()
    {
        AuthController realtimeControllerBase = this;
        SseStream sse = await realtimeControllerBase.HttpContext.OpenSseStreamAsync();
        object? obj1 = null;
        int num1 = 0;
        BackplaneConnection connection;
        try
        {
            connection = backplane.CreateConnection();
            object? obj2 = null;
            int num2 = 0;
            try
            {
                await sse.WriteAsync("connected", JsonSerializer.Serialize<RealtimeConnectionResponse>(new RealtimeConnectionResponse(connection.ConnectionId), new JsonSerializerOptions()
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                }));
                await foreach (SseEvent sseEvent in connection.ReadAllAsync(realtimeControllerBase.HttpContext.RequestAborted))
                {
                    if (sseEvent.Group != null)
                        await sse.WriteAsync(sseEvent.Group, sseEvent.Data);
                    else
                        await sse.WriteAsync(sseEvent.Data);
                }
                num2 = 1;
            }
            catch (Exception ex)
            {
                obj2 = ex;
            }
            if (connection != null)
                await connection.DisposeAsync();
            object obj = obj2;
            if (obj != null)
            {
                if (obj is not Exception source)
                    throw (Exception) obj;
                ExceptionDispatchInfo.Capture(source).Throw();
            }
            if (num2 != 1)
                obj2 = null;
            else
                num1 = 1;
        }
        catch (Exception ex)
        {
            obj1 = ex;
        }
        if (sse != null)
            await sse.DisposeAsync();
        var obj3 = obj1;
        if (obj3 != null)
        {
            if (obj3 is not Exception source)
                throw (Exception) obj3;
            ExceptionDispatchInfo.Capture(source).Throw();
        }
        if (num1 != 1)
        {
            obj1 = (object) null;
            sse = (SseStream) null;
            connection = (BackplaneConnection) null;
            throw null;
        }
    }
}