namespace service.Abstractions;

public interface ISubscriber<T, K>
{
    public T GetId();
    public K GetPayload();
}