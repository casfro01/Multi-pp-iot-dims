namespace api.Controllers.MQTT;

public record ButtonPressRequest(string deviceId, ButtonPressRequest.Button button, string ConnectCode)
{

    public enum Button
    {
        Red,
        Green,
        Blue,
        Yellow,
    }

    public static Button GetButtonFromString(string button)
    {
        return button.ToLower() switch
        {
            "red" => Button.Red,
            "blue" => Button.Blue,
            "green" => Button.Green,
            "yellow" => Button.Yellow,
            _ => Button.Red
        };
    }
}