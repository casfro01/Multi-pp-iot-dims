using api.Controllers.MQTT;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static api.Controllers.MQTT.DeviceCommandSender;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CommandSenderController(DeviceCommandSender commandSender) : ControllerBase
{
    public record BlinkCommandRequest(string DeviceId, LightCommands Command);

    [HttpPost("Blink")]
    public async Task<IActionResult> Blink([FromBody] BlinkCommandRequest request)
    {
        await commandSender.SendBlinkCommand(request.DeviceId, request.Command);
        return Ok();
    }
}