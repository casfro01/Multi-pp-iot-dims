using DataAccess.Entities;

namespace service.Models.Responses;

public class BaseQuestionResponse
{
    public BaseQuestionResponse(Question q)
    {
        Id = q.Id;
        Content  = q.Content;
        Answers =  q.Answers.Select(a => new BaseAnswerResponse(a)).ToList();
    }
    
    public int Id { get; set; }
    public string Content { get; set; }
    public List<BaseAnswerResponse> Answers { get; set; }
}