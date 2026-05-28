using Mqtt.Controllers;
using System.Text.Json;
using service.Abstractions;
using service.Models.Request;
using StateleSSE.AspNetCore;

namespace api.Controllers.MQTT;

public class QuizAnswerListener(ISseBackplane backplane) : MqttController, IPublisher<AnswerRequest>
{
    private const string GroupId = "quizAnswer";
    private const string MqttRoute = "quiz/answer";

    [MqttRoute(MqttRoute)]
    public async Task CollectAnswer(AnswerRequest answer)
    {
        await NotifySubscribers(answer);
    }

    public async Task AddSubscriber(ISubscriber<string, string> subscriber)
    {
        await backplane.Groups.AddToGroupAsync(subscriber.GetId(), GroupId + subscriber.GetPayload());
    }

    public async Task NotifySubscribers(AnswerRequest obj)
    {
        var jsonData = JsonSerializer.Serialize(obj);
        await backplane.Clients.SendToGroupAsync(GroupId + obj.Code, jsonData);
    }
}
