namespace service;

public class Score
{
    public Score(string device, string quizName, int correct, string ansRate, DateTime time)
    {
        DeviceId = device;
        QuizName = quizName;
        Correct = correct;
        AnswerRate = ansRate;
        Time = time;
    }

    public string DeviceId { get; }
    public string QuizName { get; }
    public int Correct { get; set; }
    public string AnswerRate { get; set; }
    public DateTime Time { get; }
}