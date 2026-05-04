namespace service.Abstractions;

public interface ISubscriber<in T>
{
    public void Notify(T obj);
}