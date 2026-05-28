using Mqtt.Controllers;
using System.Text.Json;
using service;
using service.Abstractions;
using service.Models.Request;
using StateleSSE.AspNetCore;

namespace api.Controllers.MQTT;

public class DeviceListener(ISseBackplane backplane, IDisplayNameService dService, DeviceCommandSender commandSender) : MqttController, IPublisher<PairingRequest>
{
    private const string GroupId = "deviceJoin"; // ved ikke om denne er nødvendig siden vi bare bruger lobbykoden til at adskille grupperne

    private const string GetNameEvent = "controller/{deviceId}/getname";

    private const string ConnectTopic = "controller/+/connectcode";
    
    [MqttRoute(ConnectTopic)]
    public async Task CollectDeviceConnection(PairingRequest pairing)
    {
        await NotifySubscribers(pairing);
    }

    [MqttRoute(GetNameEvent)]
    public async Task GetName(string deviceId, string somethingElse)
    {
        string name = await dService.GetDisplayName(deviceId);
        await commandSender.SendDisplayNameCommand(deviceId, name);
    }

    /// <summary>
    /// Tilføj subscriber til at lytte når en spiller prøver at joine en lobby
    /// </summary>
    /// <param name="subscriber">Connection ID + Kode</param>
    public async Task AddSubscriber(ISubscriber<string, string> subscriber)
    {
        await backplane.Groups.AddToGroupAsync(subscriber.GetId(), GroupId + subscriber.GetPayload());
    }

    /// <summary>
    /// Notificerer subscriber på (gruppeid + koden) som var givet
    /// </summary>
    public async Task NotifySubscribers(PairingRequest obj)
    {
        var jsonData = JsonSerializer.Serialize(obj);
        await backplane.Clients.SendToGroupAsync(GroupId + obj.Code, jsonData);
    }
}