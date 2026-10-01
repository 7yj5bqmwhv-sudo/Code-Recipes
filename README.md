# Winc React Recipe App

React Fundamentals final project built with React 19, Vite 7, and Chakra UI 3.

## Run locally

Requires a Node.js version supported by Vite 7 (Node 20.19+ or 22.12+).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. For a reproducible install from the lockfile, use `npm ci`.

## Use the app

- Browse all 20 recipes from the supplied Winc/Edamam data.
- Search by recipe name or a health/diet label, such as chicken, vegan, pescetarian, or gluten-free.
- Click a card or its View recipe button to see complete details.
- Use Back to recipes to keep your search and restore focus and scrolling.
- Use the Device / Light / Dark button to cycle the color mode. Device follows the OS; an explicit preference is saved locally.

Every overview item includes its title, image, meal/dish type, diet, cautions, and Vegan/Vegetarian labels when supplied. Details include all health labels, ingredients, servings, cooking time, and six total nutrients.

Empty diet/caution arrays display **Not provided in the source data.** They are not treated as a guarantee about allergens. Zero cooking time displays **N/A**. Nutrition is for the entire recipe.

## Verify

```bash
npm test
npm run lint
npm run build
npm run preview
```

The automated tests render and exercise the actual React components. Read [TESTING.md](TESTING.md) for their coverage and the real-browser checks still needed. A successful build alone does not establish that every browser layout has passed.

## Source map

- `src/App.jsx`: selected recipe, search state, scrolling, and focus.
- `src/pages/RecipeListPage.jsx`: overview and search controls.
- `src/pages/RecipePage.jsx`: complete recipe details.
- `src/components/RecipeLabels.jsx`: shared label sections and empty-data messages.
- `src/components/ui/`: Chakra provider and theme controls.
- `src/utils/data.js`: supplied recipe data plus fixed ingredient-row IDs.
- `src/utils/recipes.js`: filtering and nutrient formatting.
- `scripts/test-project.mjs`: automated verification.

All application JSX uses Chakra UI components. The HTML document shell in `index.html` is the Vite entry point.
