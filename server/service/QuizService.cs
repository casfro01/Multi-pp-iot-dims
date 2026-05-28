using dataaccess;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using service.Abstractions;
using service.Models.Responses;

namespace service;

public class QuizService(MyDbContext db) : IQuizService
{
    public async Task<List<BaseQuizResponse>> GetQuizzes()
    {
        IQueryable<Quiz> query = db.Quizzes
            .Include(q => q.Questions);
        var res = await query.ToListAsync();
        return res.Select(q => new BaseQuizResponse(q)).ToList();
    }

    public async Task<QuizWithQuestionsResponse?> GetQuiz(int id)
    {
        Quiz? quiz = await db.Quizzes
            .Include(q => q.Questions)
            .ThenInclude(q => q.Answers)
            .FirstOrDefaultAsync(q => q.Id == id);
        return quiz is null ? null : new QuizWithQuestionsResponse(quiz);
    }
}