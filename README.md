# Smart Recipe Generator

Personalize your next meal with ingredient intelligence, dietary filters, and instant cooking insights. This Next.js application blends manual ingredient input with Clarifai-powered image recognition to surface the best recipe matches from a curated catalog.

## ✨ Features
- Ingredient input with autocomplete, chip management, and optional image recognition (Clarifai Food Model).
- Robust validation for empty, duplicate, oversized, or unsupported image uploads.
- Dynamic recommendation engine that ranks recipes by ingredient overlap, dietary preferences, time, and difficulty.
- Detailed recipe sheets with step-by-step instructions and nutrition.
- 30 curated recipes stored locally (`data/recipes.json`) for deterministic results.

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- Clarifai Personal Access Token (PAT) for the Food Model

### Setup
```bash
npm install
cp .env.example .env.local
```
Update `.env.local` with your Clarifai PAT:
```
CLARIFAI_PAT=your-secret-token
```

### Development
```bash
npm run dev
```
Visit `http://localhost:3000` to use the app.

### Quality Gates
- `npm run lint` – ESLint (Next.js core web vitals)
- `npm run build` – Production build validation

## 🧠 Architecture Notes
- **UI**: Next.js App Router + Tailwind CSS for responsive, glassmorphic styling.
- **State**: Client-side React components with memoized selectors for scoring.
- **Data**: Typed recipe catalog (`types/recipe.ts`) and scoring logic (`lib/recipes.ts`).
- **Image Detection**: `app/api/detect/route.ts` proxies uploads to Clarifai, filtering high-confidence concepts (>75%).

## 🔐 Environment
- `CLARIFAI_PAT`: required to enable image-to-ingredient detection. Requests gracefully fail with descriptive errors when missing or invalid.

## 📦 Deployment
Build for production and deploy to Vercel:
```bash
npm run build
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-e89787af
```

After deployment, verify the site:
```bash
curl https://agentic-e89787af.vercel.app
```

## 📁 Key Paths
- `app/page.tsx` – Main experience layout
- `components/IngredientInput.tsx` – Ingredient + upload workflow
- `components/FiltersPanel.tsx` – Dietary, time, difficulty filters
- `components/RecipeList.tsx` – Ranked recipe cards
- `components/RecipeDetailSheet.tsx` – Rich recipe modal
- `lib/recipes.ts` – Scoring and helper utilities
- `data/recipes.json` – Recipe library

Enjoy cooking smarter! 🍽️
