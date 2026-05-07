namespace service.Util;

public class LobbyCodeGenerator
{
    private const int iterations = 12;
    private const int numberOfColors = 4;

    public static string GetANumberString()
    {
        string rtrn = "";
        Random rand = new Random();
        for (int i = 0; i < iterations; i++)
        {
            rtrn += rand.Next(1, numberOfColors + 1).ToString();
        }

        return rtrn;
    }
}