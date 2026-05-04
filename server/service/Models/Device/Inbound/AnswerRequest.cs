using System.ComponentModel.DataAnnotations;

namespace service.Models.Request;

public record AnswerRequest(
    [Required] string DeviceId,
    [Required] int Answer
);