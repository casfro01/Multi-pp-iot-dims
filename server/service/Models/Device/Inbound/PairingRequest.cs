using System.ComponentModel.DataAnnotations;

namespace service.Models.Request;

public record PairingRequest(
    [Required] string DeviceID,
    [Required] string Code,
    [Required] string DisplayName
);