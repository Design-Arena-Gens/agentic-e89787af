"use client";

import type { RecipeFilters } from "@/types/filters";
import type { DietaryTag, Difficulty } from "@/types/recipe";

const dietaryOptions: { value: DietaryTag; label: string }[] = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-free" }
];

const difficultyOptions: { value: Difficulty | "any"; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" }
];

interface FiltersPanelProps {
  filters: RecipeFilters;
  onChange: (filters: RecipeFilters) => void;
}

export function FiltersPanel({ filters, onChange }: FiltersPanelProps) {
  return (
    <div className="space-y-6 rounded-3xl glass p-6">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Preferences
        </h3>
        <p className="text-base font-medium text-slate-50">Refine recommendations</p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Dietary
        </p>
        <div className="flex flex-wrap gap-3">
          {dietaryOptions.map((option) => {
            const active = filters.dietary.includes(option.value);
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => {
                  const updated = active
                    ? filters.dietary.filter((item) => item !== option.value)
                    : [...filters.dietary, option.value];
                  onChange({ ...filters, dietary: updated });
                }}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  active
                    ? "border-brand-400 bg-brand-500/30 text-brand-100 shadow-lg"
                    : "border-slate-700 text-slate-200 hover:border-brand-400 hover:text-brand-100"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wide">Max cook time</span>
          <span className="text-slate-200">{filters.maxTime} min</span>
        </div>
        <input
          type="range"
          min={10}
          max={120}
          step={5}
          value={filters.maxTime}
          onChange={(event) =>
            onChange({ ...filters, maxTime: Number.parseInt(event.target.value, 10) })
          }
          className="w-full accent-brand-500"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>10</span>
          <span>60</span>
          <span>120</span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Difficulty
        </p>
        <div className="grid grid-cols-2 gap-2">
          {difficultyOptions.map((option) => {
            const active = filters.difficulty === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ ...filters, difficulty: option.value })}
                className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "border-brand-400 bg-brand-500/30 text-brand-100"
                    : "border-slate-700 text-slate-200 hover:border-brand-400 hover:text-brand-100"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange({
            dietary: [],
            maxTime: 45,
            difficulty: "any"
          })
        }
        className="w-full rounded-full border border-slate-700 py-2 text-sm text-slate-300 transition hover:border-brand-400 hover:text-brand-100"
      >
        Reset filters
      </button>
    </div>
  );
}
