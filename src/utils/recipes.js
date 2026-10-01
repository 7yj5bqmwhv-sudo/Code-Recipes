import { data } from './data';

export const recipes = data.hits.map(({ recipe }) => recipe);
const normalize = (value) => value.trim().toLowerCase().replace(/[\s-]+/g, ' ');

export const filterRecipes = (query) => {
  const needle = normalize(query);
  return recipes.filter((recipe) => !needle || [
    recipe.label,
    ...(recipe.healthLabels || []),
    ...(recipe.dietLabels || []),
    ...(recipe.mealType || []),
    ...(recipe.dishType || []),
  ].some((value) => normalize(value).includes(needle)));
};

export const nutrients = [
  ['Energy', 'ENERC_KCAL'], ['Protein', 'PROCNT'], ['Fat', 'FAT'],
  ['Carbs', 'CHOCDF'], ['Cholesterol', 'CHOLE'], ['Sodium', 'NA'],
];

export const formatNutrient = (recipe, key) => {
  const item = recipe.totalNutrients?.[key];
  return item && Number.isFinite(item.quantity)
    ? `${Math.round(item.quantity)} ${item.unit}`
    : 'N/A';
};
