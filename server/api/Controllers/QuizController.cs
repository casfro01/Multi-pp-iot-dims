using DataAccess.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using service.Abstractions;
using service.Models.Responses;

namespace api.Controllers;

[ApiController]
[Route("api/[Controller]")]
public class QuizController(IQuizService quizService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    [Route("GetQuizzes")]
    public async Task<List<BaseQuizResponse?>> GetQuizzes()
    {
        List<BaseQuizResponse> quizzes = await quizService.GetQuizzes();
        return quizzes!;
    }
}