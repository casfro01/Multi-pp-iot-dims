namespace service;

public record NewScoreDto(string deviceId, int quizId, int questionId, bool correct);