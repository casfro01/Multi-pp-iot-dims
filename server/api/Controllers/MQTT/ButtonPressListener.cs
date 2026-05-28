using System.Text.Json;
using Mqtt.Controllers;
using service.Abstractions;
using StateleSSE.AspNetCore;

namespace api.Controllers.MQTT;

public class ButtonPressListener(ISseBackplane backplane) : MqttController, IPublisher<ButtonPressRequest>
{
    private const string ButtonPressRoute = "controller/{deviceId}/buttonpress";

    [MqttRoute(ButtonPressRoute)]
    public async Task CollectButtonPress(string deviceId, string message)
    {
        await NotifySubscribers(new ButtonPressRequest(deviceId, ButtonPressRequest.GetButtonFromString(message)));
    }
    
    /// <summary>
    /// Subscribe to a device's buttonpress
    /// Subscriber id -> connection-string
    /// Subscriber payload -> deviceId
    /// </summary>
    public async Task AddSubscriber(ISubscriber<string, string> subscriber)
    {
        await backplane.Groups.AddToGroupAsync(subscriber.GetId(), subscriber.GetPayload());
    }

    public async Task NotifySubscribers(ButtonPressRequest obj)
    {
        var jsonData = JsonSerializer.Serialize(obj);
        await backplane.Clients.SendToGroupAsync(obj.deviceId, jsonData);
    }
    
}