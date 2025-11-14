"use client";

import { useMemo, useState } from "react";
import { IngredientInput } from "@/components/IngredientInput";
import { FiltersPanel } from "@/components/FiltersPanel";
import { RecipeDetailSheet } from "@/components/RecipeDetailSheet";
import { RecipeList } from "@/components/RecipeList";
import { getAllIngredients, getAllRecipes, matchRecipes } from "@/lib/recipes";
import type { RecipeMatch } from "@/lib/recipes";
import type { RecipeFilters } from "@/types/filters";
import type { Recipe } from "@/types/recipe";

const allIngredients = getAllIngredients();
const allRecipes = getAllRecipes();

export default function HomePage() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [filters, setFilters] = useState<RecipeFilters>({
    dietary: [],
    maxTime: 45,
    difficulty: "any"
  });
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const matches: RecipeMatch[] = useMemo(() => {
    return matchRecipes({
      ingredients: selectedIngredients,
      dietaryFilters: filters.dietary,
      maxTime: filters.maxTime,
      difficulty: filters.difficulty === "any" ? undefined : filters.difficulty
    });
  }, [selectedIngredients, filters]);

  const selectedRecipe: Recipe | undefined = useMemo(
    () => allRecipes.find((recipe) => recipe.id === selectedRecipeId),
    [selectedRecipeId]
  );

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-48 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute right-10 top-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-16">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[1em] text-brand-300">Smart kitchen</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-50 md:text-5xl">
            Discover recipes tailored to your pantry
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
            Combine ingredient intelligence, dietary preferences, and cooking constraints to
            surface the recipes that fit your moment. Upload a photo or type ingredients to get
            started.
          </p>
        </header>

        <section className="mt-12 grid gap-8 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-8">
            <IngredientInput
              allIngredients={allIngredients}
              selectedIngredients={selectedIngredients}
              onAddIngredient={(ingredient) =>
                setSelectedIngredients((prev) => [...prev, ingredient])
              }
              onRemoveIngredient={(ingredient) =>
                setSelectedIngredients((prev) => prev.filter((item) => item !== ingredient))
              }
              onBulkAdd={(ingredients) =>
                setSelectedIngredients((prev) => {
                  const set = new Set(prev);
                  ingredients.forEach((ingredient) => set.add(ingredient));
                  return Array.from(set);
                })
              }
            />

            <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900/60 px-6 py-4 text-sm text-slate-300">
              <span>
                {matches.length > 0
                  ? `Top ${matches.length} recipe matches`
                  : "No matches yet"}
              </span>
              <span className="font-semibold text-brand-200">
                {selectedIngredients.length} ingredient
                {selectedIngredients.length === 1 ? "" : "s"}
              </span>
            </div>

            <RecipeList matches={matches} onSelect={(id) => setSelectedRecipeId(id)} />
          </div>

          <FiltersPanel filters={filters} onChange={setFilters} />
        </section>
      </div>

      {selectedRecipe ? (
        <RecipeDetailSheet recipe={selectedRecipe} onClose={() => setSelectedRecipeId(null)} />
      ) : null}
    </main>
  );
}
