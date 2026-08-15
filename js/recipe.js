import { getMealById } from "./api.mjs";
import { saveRecentlyViewed, saveFavoriteMeal } from "./storage.mjs";

function displayIngredients(meal) {
  const ingredientList = document.querySelector("#ingredientList");

  ingredientList.innerHTML = "";

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (!ingredient || ingredient.trim() === "") {
      continue;
    }
    const listItem = document.createElement("li");
    listItem.textContent = `${measure} ${ingredient}`.trim();
    ingredientList.appendChild(listItem);
  }
}

function displayInstructions(meal) {
  const instructionsContainer = document.querySelector("#recipeInstructions");

  instructionsContainer.innerHTML = "";

  const instructions = meal.strInstructions
    .split(/\r?\n/)
    .map((instruction) => instruction.trim())
    .filter((instruction) => instruction !== "");
  instructions.forEach((instruction) => {
    const paragraph = document.createElement("p");

    paragraph.textContent = instruction;

    instructionsContainer.appendChild(paragraph);
  });
}

function showRecipeStatus(message) {
  const recipeStatus = document.querySelector("#recipeStatus");

  if (recipeStatus) {
    recipeStatus.textContent = message;
  }
}

function saveMealFavorite(meal) {
  const favoriteMeal = {
    id: meal.idMeal,
    name: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory,
    cuisine: meal.strArea,
  };
  return saveFavoriteMeal(favoriteMeal);
}

function setupMealFavoriteButton(meal) {
  const favoriteButton = document.querySelector("#favoriteMealButton");
  if (!favoriteButton) {
    return;
  }

  favoriteButton.addEventListener("click", () => {
    const saved = saveMealFavorite(meal);

    if (saved) {
      favoriteButton.textContent = "Added to Favorites";
      favoriteButton.setAttribute("aria-pressed", "true");
    } else {
      favoriteButton.textContent = "Already in Favorites";
      favoriteButton.setAttribute("aria-pressed", "true");
    }
  });
}

async function loadRecipe() {
  const urlParams = new URLSearchParams(window.location.search);

  const mealId = urlParams.get("id");

  if (!mealId) {
    showRecipeStatus("No recipe was selected.");
    return;
  }

  try {
    const data = await getMealById(mealId);

    if (!data.meals || data.meals.length === 0) {
      showRecipeStatus("Recipe not found.");
      return;
    }

    const meal = data.meals[0];

    saveRecentlyViewed({
      id: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
      type: "meal",
    });

    document.querySelector("#recipeTitle").textContent = meal.strMeal;
    document.querySelector("#recipeCategory").textContent = meal.strCategory;
    document.querySelector("#recipeCuisine").textContent = meal.strArea;
    const recipeImage = document.querySelector("#recipeImage");
    recipeImage.src = meal.strMealThumb;
    recipeImage.alt = meal.strMeal;
    displayIngredients(meal);
    displayInstructions(meal);
    setupMealFavoriteButton(meal);
  } catch (error) {
    console.error("Unable to load recipe", error);
    showRecipeStatus("Unable to load the recipe. Please try again.");
  }
}

export function initializeRecipe() {
  loadRecipe();
}
