namespace DataAccess.Entities;

public partial class Question
{
    public int Id { get; set; }

    public int QuizId { get; set; }

    public string? Content { get; set; }

    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();

    public virtual Quiz Quiz { get; set; } = null!;
}
