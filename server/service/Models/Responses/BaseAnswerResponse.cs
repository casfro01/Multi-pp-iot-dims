using System.ComponentModel.DataAnnotations;
using DataAccess.Entities;

namespace service.Models.Responses;

public class BaseAnswerResponse
{
    public BaseAnswerResponse(Answer answer)
    {
        Id = answer.Id;
        Correct = answer.Correct;
        Content = answer.Content;
    }
    
    public int Id { get; set; }
    public bool Correct { get; set; }
    
    [Required]
    public string Content  { get; set; }
    
    
}