using System;
using System.Collections.Generic;

namespace dataaccess;

public partial class UserDeviceLink
{
    public int Id { get; set; }

    public string? UserId { get; set; }

    public string? DeviceId { get; set; }

    public string? DisplayName { get; set; }

    public virtual User? User { get; set; }
}
