import type { DietaryTag, Difficulty } from "./recipe";

export interface RecipeFilters {
  dietary: DietaryTag[];
  maxTime: number;
  difficulty: Difficulty | "any";
}
