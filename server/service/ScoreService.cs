using System.ComponentModel.DataAnnotations;
using dataaccess;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace service;

public class ScoreService(MyDbContext ctx) : IScoreService
{
    public async Task<List<Score>> GetScores(string userId, int amount)
    {
        var user = await ctx.Users.Include(u => u.UserDeviceLinks).FirstOrDefaultAsync(x => x.Id == userId);
        if (user == null || user.UserDeviceLinks.Count == 0) throw new ValidationException("Don't have a device");
        
        var udl = user.UserDeviceLinks.Select(d => d.DeviceId).ToList();

        var scores = await ctx.ScoreLogs
            .Where(d => udl.Contains(d.DeviceId))
            .GroupBy(sc => new
            {
                sc.QuizId,
                sc.DeviceId,
                QuizName = sc.Quiz.Name,
                sc.DateTime
            })
            .Select(g => new Score(
                g.Key.DeviceId,
                g.Key.QuizName ?? "None",
                g.Count(x => x.Correct),
                g.Count(x => x.Correct) + "/" + g.First().Quiz.Questions.Count,
                g.Max(x => x.DateTime)
            ))
            .OrderByDescending(sc => sc.Time)
            .Take(amount)
            .ToListAsync();
        return scores;
    }

    public async Task AddScoreLog(NewScoreDto score)
    {
        var quiz = await ctx.Quizzes.FirstOrDefaultAsync(q => q.Id == score.quizId);
        var ans = await ctx.Questions.FirstOrDefaultAsync(que => que.Id == score.questionId);
        if (quiz == null || ans == null) throw new ValidationException("Quiz not found or ans not there");

        ScoreLog s = new ScoreLog()
        {
            QuizId = quiz.Id,
            Correct = score.correct,
            DateTime = DateTime.UtcNow,
            DeviceId = score.deviceId,
            Question = ans,
            QuestionId = score.questionId,
            Quiz = quiz
        };
        ctx.Add(s);
        await ctx.SaveChangesAsync();
    }
}