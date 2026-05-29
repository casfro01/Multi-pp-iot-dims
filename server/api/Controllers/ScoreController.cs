using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using service;

namespace api.Controllers;

[ApiController]
[Route("api/[Controller]")]
[Authorize]
public class ScoreController(IScoreService service) : ControllerBase
{
    [HttpGet]
    [Route(nameof(GetScore))]
    public async Task<List<Score>> GetScore()
    {
        var userID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userID == null) return new();
        // use userid
        return await service.GetScores(userID, 25);
    }

    [HttpPost]
    [Route(nameof(SaveRound))]
    public async Task SaveRound(List<NewScoreDto> scores)
    {
        await Task.WhenAll(
            scores.Select(service.AddScoreLog)
        );
    }
}