using System.ComponentModel.DataAnnotations;
using DataAccess.Entities;

namespace service.Models.Responses;

public class BaseQuizResponse
{
    public BaseQuizResponse(Quiz q)
    {
        Id = q.Id;
        Name = q.Name;
    }
    
    public int Id { get; set; }
    
    [Required]
    public string Name  { get; set; }
}