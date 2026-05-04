using System.ComponentModel.DataAnnotations;

namespace service.Models.Request;

public record PairingRequest(
    [Required] string DeviceId,
    [Required] string Code
);