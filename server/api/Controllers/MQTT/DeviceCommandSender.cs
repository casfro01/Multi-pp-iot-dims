using Mqtt.Controllers;

namespace api.Controllers.MQTT;

public class DeviceCommandSender(IMqttClientService clientService)
{
    public async Task SendBlinkCommand(string deviceId, LightCommands command)
    {
        await clientService.PublishAsync($"command/{deviceId}/light/animation", command.ToString());
    }

    public async Task SendDisplayNameCommand(string deviceId, string name)
    {
        await clientService.PublishAsync($"command/{deviceId}/setname", name);
    }


    public enum LightCommands
    {
        GreenBlink,
        RedBlink,
        YellowBlink,
        BlueBlink,
        Pulse,
        Train
    }
}