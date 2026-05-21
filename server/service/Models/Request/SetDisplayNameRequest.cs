namespace api.Controllers;

public class SetDisplayNameRequest(string deviceId, string displayName, string code)
{
    public string UserId { get; set; } = "";
    public string DeviceId { get; set; } = deviceId;
    public string Code { get; set; } = code;
    public string DisplayName { get; set; } = displayName;
}