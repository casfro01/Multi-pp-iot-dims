import type {NewScoreDto} from "../core/ServerAPI.ts";
import {scoreClient} from "../core/api-clients.ts";

export async function saveScores(scores: NewScoreDto[]): Promise<void> {
    await scoreClient.saveRound(scores);
    return;
}