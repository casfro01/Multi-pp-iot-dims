using api.Controllers.MQTT;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CommandSenderController(DeviceCommandSender commandSender) : ControllerBase
{
    
}