using Mqtt.Controllers;
using Newtonsoft.Json;
using service.Models.Request;

namespace api.Controllers.MQTT;

public class DeviceListener : MqttController
{

    [MqttRoute("my/topic")]
    public async Task CollectDeviceConnection(PairingRequest pairing)
    {
        Console.WriteLine("FDSJFHSDJFHDSHFKSDHFKSDJHFKJDSHFKJSDHFDKS " + JsonConvert.SerializeObject(pairing));
    }
    
}