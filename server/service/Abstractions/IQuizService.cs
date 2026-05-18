using DataAccess.Entities;
using service.Models.Responses;

namespace service.Abstractions;

public interface IQuizService
{
    Task<List<BaseQuizResponse>> GetQuizzes(); 
}