namespace DataAccess.Entities;

public partial class ScoreLog
{
    public int Id { get; set; }

    public string DeviceId { get; set; } = null!;

    public string LobbyCode { get; set; } = null!;

    public int QuizId { get; set; }

    public int QuestionId { get; set; }

    public bool Correct { get; set; }

    public DateTime DateTime { get; set; }

    public virtual Question Question { get; set; } = null!;

    public virtual Quiz Quiz { get; set; } = null!;
}
