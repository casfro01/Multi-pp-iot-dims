namespace service;

public record NewScoreDto(string deviceId, int quizId, int questionId, string lobbyCode, bool correct);