import { Difficulty } from "../models/Difficulty.model";

export abstract class DifficultyProvider {
    abstract countRows(): Promise<number>;
    abstract saveDifficulty(difficultyModel: Difficulty): Promise<void>
}
