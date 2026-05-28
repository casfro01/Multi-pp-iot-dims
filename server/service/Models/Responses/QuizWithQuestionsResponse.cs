using System.ComponentModel.DataAnnotations;
using DataAccess.Entities;

namespace service.Models.Responses;

public class QuizWithQuestionsResponse
{
    public QuizWithQuestionsResponse(Quiz q)
    {
        Id = q.Id;
        Name = q.Name;
        Questions = q.Questions.Select(question => new BaseQuestionResponse(question)).ToList();
    }

    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    public List<BaseQuestionResponse> Questions { get; set; }
}
