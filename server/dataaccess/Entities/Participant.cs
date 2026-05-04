using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DataAccess.Entities;

public partial class Participant
{
    public string DisplayName { get; set; } = null!;

    public string DeviceId { get; set; } = null!;

    public List<int> Answers { get; set; } = null!;
}