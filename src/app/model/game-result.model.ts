import { Tier } from "./tier.model";

export interface GameResult {
    win: boolean;
    numberOfCorrectGuesses: number;
    tier: Tier;
}