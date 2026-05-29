namespace service;

public interface IScoreService
{
    Task<List<Score>> GetScores(string userId, int amount);
    public Task AddScoreLog(NewScoreDto score);
}