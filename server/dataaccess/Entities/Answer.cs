namespace DataAccess.Entities;

public partial class Answer
{
    public int Id { get; set; }

    public bool Correct { get; set; }

    public string? Content { get; set; }

    public int QuestionId { get; set; }

    public virtual Question Question { get; set; } = null!;
}
