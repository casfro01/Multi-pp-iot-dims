using System.Runtime.ExceptionServices;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StateleSSE.AspNetCore;

namespace api.Controllers;

[ApiController]
[Route("api/auth")]
public class SubscriberController(ISseBackplane backplane) : ControllerBase
{
    
    
    
    [HttpGet("sse")]
    [Authorize]
    public async Task Connect()
    {
        SubscriberController realtimeControllerBase = this;
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


    [HttpGet(nameof(SubscribeToDeviceConnection))]
    [Authorize]
    public async Task SubscribeToDeviceConnection(string connectionId)
    {
        throw new NotImplementedException("LLLLLLLLLLLll");
    }
}