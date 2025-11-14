export type DietaryTag = "vegetarian" | "vegan" | "gluten-free";

export type Difficulty = "easy" | "medium" | "hard";

export interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  dietary: DietaryTag[];
  difficulty: Difficulty;
  cookingTimeMinutes: number;
  instructions: string[];
  nutrition: RecipeNutrition;
}
