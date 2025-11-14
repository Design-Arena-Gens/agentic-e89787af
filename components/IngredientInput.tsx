"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { z } from "zod";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const detectionResponseSchema = z.object({
  ingredients: z.array(z.string())
});

interface IngredientInputProps {
  allIngredients: string[];
  selectedIngredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
  onBulkAdd: (ingredients: string[]) => void;
}

export function IngredientInput({
  allIngredients,
  selectedIngredients,
  onAddIngredient,
  onRemoveIngredient,
  onBulkAdd
}: IngredientInputProps) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [detected, setDetected] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedSelected = useMemo(
    () => selectedIngredients.map((ingredient) => ingredient.toLowerCase()),
    [selectedIngredients]
  );

  const filteredSuggestions = useMemo(() => {
    if (!query) {
      return allIngredients
        .filter((ingredient) => !normalizedSelected.includes(ingredient.toLowerCase()))
        .slice(0, 8);
    }

    return allIngredients
      .filter((ingredient) => {
        const lower = ingredient.toLowerCase();
        return (
          lower.includes(query.toLowerCase()) &&
          !normalizedSelected.includes(lower)
        );
      })
      .slice(0, 8);
  }, [query, allIngredients, normalizedSelected]);

  const handleAdd = useCallback(
    (raw: string) => {
      const ingredient = raw.trim();
      if (!ingredient) {
        setError("Please enter an ingredient before adding.");
        return;
      }
      if (normalizedSelected.includes(ingredient.toLowerCase())) {
        setError("That ingredient is already selected.");
        return;
      }
      onAddIngredient(ingredient);
      setQuery("");
      setError(null);
      inputRef.current?.focus();
    },
    [normalizedSelected, onAddIngredient]
  );

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null);
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("Unsupported file type. Please upload JPG, PNG, or WEBP files.");
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", file);
        const response = await fetch("/api/detect", {
          method: "POST",
          body: formData
        });
        if (!response.ok) {
          throw new Error("Image recognition failed. Please try again.");
        }
        const payload = await response.json();
        const parsed = detectionResponseSchema.safeParse(payload);
        if (!parsed.success) {
          throw new Error("Received unexpected response from recognition service.");
        }
        const unique = parsed.data.ingredients.filter(
          (ingredient) => !normalizedSelected.includes(ingredient.toLowerCase())
        );
        setDetected(unique);
        if (unique.length === 0) {
          setError("No new ingredients detected.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        setIsUploading(false);
      }
    },
    [normalizedSelected]
  );

  const handleDetectedAdd = useCallback(
    (ingredient: string) => {
      onAddIngredient(ingredient);
      setDetected((prev) => prev.filter((item) => item !== ingredient));
    },
    [onAddIngredient]
  );

  const acceptAllDetected = useCallback(() => {
    if (detected.length > 0) {
      onBulkAdd(detected);
      setDetected([]);
    }
  }, [detected, onBulkAdd]);

  return (
    <div className="space-y-4 rounded-3xl glass p-6 shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <label htmlFor="ingredient-input" className="block text-sm font-medium text-slate-300">
            Add ingredients
          </label>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3">
            <input
              ref={inputRef}
              id="ingredient-input"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleAdd(query);
                }
              }}
              placeholder="e.g. chickpeas, garlic, spinach"
              className="flex-1 bg-transparent text-base text-slate-100 outline-none placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => handleAdd(query)}
              className="rounded-full bg-brand-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-400"
            >
              Add
            </button>
          </div>
        </div>
        <div>
          <label className="flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-slate-600 px-6 py-3 text-sm text-slate-300 transition hover:border-brand-400 hover:text-brand-300">
            <input
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleUpload(file);
                  event.target.value = "";
                }
              }}
            />
            <span className="font-semibold text-slate-100">Upload image</span>
            <span className="mt-1 text-xs text-slate-400">
              {isUploading ? "Detecting ingredients..." : "Clarifai food model"}
            </span>
          </label>
        </div>
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        {selectedIngredients.map((ingredient) => (
          <span
            key={ingredient}
            className="group inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-4 py-2 text-sm text-brand-100"
          >
            {ingredient}
            <button
              type="button"
              onClick={() => onRemoveIngredient(ingredient)}
              className="rounded-full bg-brand-500/40 px-2 text-xs text-white transition group-hover:bg-brand-400"
            >
              ×
            </button>
          </span>
        ))}
        {selectedIngredients.length === 0 ? (
          <span className="text-sm text-slate-500">Selected ingredients will appear here.</span>
        ) : null}
      </div>

      {filteredSuggestions.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAdd(suggestion)}
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 transition hover:border-brand-500 hover:text-brand-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {detected.length > 0 ? (
        <div className="rounded-2xl border border-brand-500/40 bg-brand-500/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-100">Detected ingredients</p>
              <p className="text-xs text-brand-200">
                Confirm the ingredients identified from your image.
              </p>
            </div>
            <button
              type="button"
              onClick={acceptAllDetected}
              className="rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-brand-400"
            >
              Add all
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {detected.map((ingredient) => (
              <button
                key={ingredient}
                type="button"
                onClick={() => handleDetectedAdd(ingredient)}
                className="rounded-full border border-brand-400 px-3 py-1 text-xs text-brand-100 transition hover:bg-brand-400 hover:text-white"
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
