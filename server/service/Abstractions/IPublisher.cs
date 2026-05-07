namespace service.Abstractions;

public interface IPublisher<T>
{
    public Task AddSubscriber(ISubscriber<string, string> subscriber);

    public Task NotifySubscribers(T obj);
}