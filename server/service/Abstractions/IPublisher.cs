namespace service.Abstractions;

public interface IPublisher<T>
{
    public void AddSubscriber(ISubscriber<T> subscriber);
}