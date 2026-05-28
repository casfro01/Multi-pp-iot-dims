using System.Text.Json;
using Mqtt.Controllers;
using NLog;
using service.Abstractions;
using service.Models.Request;
using StateleSSE.AspNetCore;

namespace api.Controllers.MQTT;

public class ButtonPressListener(ISseBackplane backplane) : MqttController, IPublisher<ButtonPressRequest>
{
    private const string ButtonPressRoute = "controller/{deviceId}/buttonpress";

    [MqttRoute(ButtonPressRoute)]
    public async Task CollectButtonPress(string deviceId, ButtonPressRaw message)
    {
        Console.WriteLine(message);
        await NotifySubscribers(new ButtonPressRequest(deviceId, ButtonPressRequest.GetButtonFromString(message.Button), message.ConnectCode));
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