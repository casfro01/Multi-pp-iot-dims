namespace DataAccess.Entities;

public partial class UserDeviceLink
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public string DeviceId { get; set; } = null!;

    public string DisplayName { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
