using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DataAccess.Entities;

public partial class Session
{
    public bool IsStarted { get; set; } = false;

    public Quiz Quiz { get; set; } = null!;

    public List<Participant> Participants { get; set; } = null!;
}