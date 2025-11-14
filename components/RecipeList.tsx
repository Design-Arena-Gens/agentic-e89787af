"use client";

import type { RecipeMatch } from "@/lib/recipes";

interface RecipeListProps {
  matches: RecipeMatch[];
  onSelect: (id: string) => void;
}

export function RecipeList({ matches, onSelect }: RecipeListProps) {
  if (matches.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-700 bg-slate-900/40 p-10 text-center text-slate-400">
        <p className="text-lg font-semibold text-slate-200">
          No matches yet — start by adding ingredients.
        </p>
        <p className="mt-2 text-sm text-slate-400">
          We will show the most relevant recipes as soon as you add at least one ingredient or
          adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {matches.map((match) => (
        <button
          key={match.recipe.id}
          type="button"
          onClick={() => onSelect(match.recipe.id)}
          className="group flex flex-col rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-left shadow-lg transition hover:-translate-y-1 hover:border-brand-400/60 hover:shadow-brand-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-200">
              Match {match.score}
            </span>
            <span className="text-xs uppercase text-slate-500">
              {match.recipe.cookingTimeMinutes} min • {match.recipe.difficulty}
            </span>
          </div>
          <h3 className="mt-3 text-xl font-semibold text-slate-50 transition group-hover:text-brand-100">
            {match.recipe.title}
          </h3>
          <p className="mt-2 text-sm text-slate-400">{match.recipe.description}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
            {match.overlapIngredients.map((ingredient) => (
              <span
                key={ingredient}
                className="rounded-full border border-brand-400/30 px-3 py-1 text-brand-100/80"
              >
                {ingredient}
              </span>
            ))}
            {match.recipe.dietary.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-700 px-3 py-1 capitalize text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 text-xs text-slate-500">
            {match.reasons.map((reason) => (
              <span key={reason} className="mr-3 inline-flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-brand-400" />
                {reason}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}
