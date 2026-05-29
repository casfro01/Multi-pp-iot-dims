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
        var udl = user.UserDeviceLinks.Select(d => d.DeviceId).ToList();
        if (user == null || user.UserDeviceLinks.Count == 0) throw new ValidationException("Don't have a device");
        
        var raw = await ctx.ScoreLogs
            .Where(d => udl.Contains(d.DeviceId))
            .GroupBy(sc => new
            {
                sc.LobbyCode,
                sc.QuizId,
                sc.DeviceId,
                QuizName = sc.Quiz.Name
            })
            .Select(g => new
            {
                g.Key.DeviceId,
                g.Key.QuizId,
                g.Key.QuizName,
                Correct = g.Count(x => x.Correct),
                Total = g.Count(),
                LastTime = g.Max(x => x.DateTime)
            })
            .ToListAsync();
        
        var scores = raw
            .Select(x => new Score(
                x.DeviceId,
                x.QuizName ?? "None",
                x.Correct,
                $"{x.Correct}/{x.Total}",
                x.LastTime
            ))
            .OrderByDescending(x => x.Time)
            .Take(amount)
            .ToList();
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
            LobbyCode = score.lobbyCode,
            Question = ans,
            QuestionId = score.questionId,
            Quiz = quiz
        };
        ctx.Add(s);
        await ctx.SaveChangesAsync();
    }
}