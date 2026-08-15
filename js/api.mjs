const mealApiUrl = "https://www.themealdb.com/api/json/v1/1";
const cocktailApiUrl = "https://www.thecocktaildb.com/api/json/v1/1";

async function requestApi(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
}

// Meal API
export async function searchMealsByName(mealName) {
  const url = `${mealApiUrl}/search.php?s=${encodeURIComponent(mealName)}`;
  return requestApi(url);
}

export async function getMealById(mealId) {
  const url = `${mealApiUrl}/lookup.php?i=${encodeURIComponent(mealId)}`;
  return requestApi(url);
}

export async function getRandomMeal() {
  const url = `${mealApiUrl}/random.php`;
  return requestApi(url);
}

export async function getMealsByCategory(category) {
  const url = `${mealApiUrl}/filter.php?c=${encodeURIComponent(category)}`;
  return requestApi(url);
}

export async function getMealsByArea(area) {
  const url = `${mealApiUrl}/filter.php?a=${encodeURIComponent(area)}`;
  return requestApi(url);
}

// Cocktail API

export async function searchCocktailsByName(cocktailName) {
  const url = `${cocktailApiUrl}/search.php?s=${encodeURIComponent(cocktailName)}`;
  return requestApi(url);
}

export async function getCocktailById(cocktailId) {
  const url = `${cocktailApiUrl}/lookup.php?i=${encodeURIComponent(cocktailId)}`;
  return requestApi(url);
}

export async function getRandomCocktail() {
  const url = `${cocktailApiUrl}/random.php`;
  return requestApi(url);
}

export async function getCocktailsByCategory(category) {
  const url = `${cocktailApiUrl}/filter.php?c=${encodeURIComponent(category)}`;
  return requestApi(url);
}

export async function getCocktailsByAlcoholicType(type) {
  const url = `${cocktailApiUrl}/filter.php?a=${encodeURIComponent(type)}`;
  return requestApi(url);
}
