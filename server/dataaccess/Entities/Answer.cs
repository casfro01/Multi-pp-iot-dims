using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DataAccess.Entities;

public partial class Answer
{
    public string AnswerText { get; set; } = null!;

    public bool IsCorrect { get; set; } = false;
}