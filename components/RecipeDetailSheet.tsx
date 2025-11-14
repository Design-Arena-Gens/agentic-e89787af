"use client";

import type { Recipe } from "@/types/recipe";
import { Fragment, useEffect } from "react";
import { createPortal } from "react-dom";

interface RecipeDetailSheetProps {
  recipe: Recipe;
  onClose: () => void;
}

export function RecipeDetailSheet({ recipe, onClose }: RecipeDetailSheetProps) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur">
      <div className="mx-4 mb-6 w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl md:mb-12">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-300">
              {recipe.difficulty} • {recipe.cookingTimeMinutes} min
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-50">{recipe.title}</h2>
            <p className="mt-3 text-sm text-slate-400">{recipe.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-800/70 px-3 py-1 text-sm text-slate-300 transition hover:bg-brand-500 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Ingredients
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient} className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-400" />
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Nutrition (per serving)
            </h3>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-200">
              <Fragment>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                  <dt className="text-xs uppercase text-slate-500">Calories</dt>
                  <dd className="text-lg font-semibold text-slate-50">
                    {recipe.nutrition.calories}
                  </dd>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                  <dt className="text-xs uppercase text-slate-500">Protein</dt>
                  <dd className="text-lg font-semibold text-slate-50">
                    {recipe.nutrition.protein}g
                  </dd>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                  <dt className="text-xs uppercase text-slate-500">Carbs</dt>
                  <dd className="text-lg font-semibold text-slate-50">
                    {recipe.nutrition.carbs}g
                  </dd>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                  <dt className="text-xs uppercase text-slate-500">Fat</dt>
                  <dd className="text-lg font-semibold text-slate-50">
                    {recipe.nutrition.fat}g
                  </dd>
                </div>
              </Fragment>
            </dl>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Steps
          </h3>
          <ol className="mt-4 space-y-4 text-sm text-slate-200">
            {recipe.instructions.map((step, index) => (
              <li key={step} className="flex items-start gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/40 text-sm font-semibold text-brand-100">
                  {index + 1}
                </span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>,
    document.body
  );
}
