using service.Abstractions;

namespace service.Models.Subscribers;

public class DeviceSubscriber(string id, string payload) : ISubscriber<string, string>
{
    private string Id { get; } = id;
    private string Payload { get; } = payload;
    
    public string GetId()
    {
        return Id;
    }

    public string GetPayload()
    {
        return Payload;
    }
}