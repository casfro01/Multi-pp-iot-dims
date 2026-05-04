namespace service.Models.Responses;

public record GameResultsResponse(IReadOnlyList<ParticipantResponses> Participants); // sorteret efter rank