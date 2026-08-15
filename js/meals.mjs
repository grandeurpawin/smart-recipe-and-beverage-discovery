import {
  searchMealsByName,
  getMealsByCategory,
  getMealsByArea,
  getRandomMeal,
} from "./api.mjs";
import { getFavoriteMeals } from "./storage.mjs";

function createMealCard(meal) {
  const article = document.createElement("article");

  article.classList.add("meal-card");

  article.innerHTML = `
    <img src="${meal.strMealThumb}"
    alt="${meal.strMeal}"
    >
    <div class="meal-card-content">
    <h3>
    ${meal.strMeal}
    </h3>
    <p>
    ${meal.strCategory || "Meal"}
    </p>
    <a href="recipe.html?id=${meal.idMeal}" class="view-recipe">View Recipe</a>
    </div>
    `;
  return article;
}

function displayMeals(meals) {
  const mealResults = document.querySelector("#mealResults");

  if (!mealResults) {
    return;
  }

  mealResults.innerHTML = "";

  meals.forEach((meal) => {
    const mealCard = createMealCard(meal);

    mealResults.appendChild(mealCard);
  });
}

export async function searchAndDisplayMeals(mealName) {
  const mealStatus = document.querySelector("#mealStatus");

  try {
    if (mealStatus) {
      mealStatus.textContent = "Searching for meals...";
    }
    const data = await searchMealsByName(mealName);

    if (!data.meals) {
      displayMeals([]);

      if (mealStatus) {
        mealStatus.textContent = "No meals found.";
      }
      return;
    }
    displayMeals(data.meals);

    if (mealStatus) {
      mealStatus.textContent = `${data.meals.length} meal(s) found.`;
    }
  } catch (error) {
    console.error("Unable to load meals:", error);
    if (mealStatus) {
      mealStatus.textContent = "Unable to load meals. Please try again.";
    }
  }
}

function setupMealSearch() {
  const searchForm = document.querySelector("#mealSearchForm");

  const searchInput = document.querySelector("#mealSearch");

  if (!searchForm || !searchInput) {
    return;
  }

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const mealName = searchInput.value.trim();

    if (!mealName) {
      return;
    }

    await searchAndDisplayMeals(mealName);
  });
}

function setupMealCategories() {
  const categoryContainer = document.querySelector("#mealCategories");

  if (!categoryContainer) {
    return;
  }
  categoryContainer.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) {
      return;
    }
    const category = button.dataset.category;

    await loadMealsByCategory(category);
  });
}

async function loadMealsByCategory(category) {
  const mealStatus = document.querySelector("#mealStatus");
  try {
    if (mealStatus) {
      mealStatus.textContent = `Loading ${category} meals...`;
    }
    const data = await getMealsByCategory(category);

    if (!data.meals) {
      displayMeals([]);
      if (mealStatus) {
        mealStatus.textContent = `No ${category} meals found.`;
      }
      return;
    }
    displayMeals(data.meals);
    if (mealStatus) {
      mealStatus.textContent = `${data.meals.length} ${category} meal(s) found.`;
    }
  } catch (error) {
    console.error("Unable to load category meals", error);
    if (mealStatus) {
      mealStatus.textContent = "Unable to load category meals.";
    }
  }
}

async function loadMealsByCuisine(cuisine) {
  const mealStatus = document.querySelector("#mealStatus");

  try {
    if (mealStatus) {
      mealStatus.textContent = `Loading ${cuisine} meals...`;
    }
    const data = await getMealsByArea(cuisine);

    if (!data.meals) {
      displayMeals([]);

      if (mealStatus) {
        mealStatus.textContent = `No ${cuisine} meals found.`;
      }
      return;
    }
    displayMeals(data.meals);

    if (mealStatus) {
      mealStatus.textContent = `${data.meals.length} ${cuisine} meal(s) found.`;
    }
  } catch (error) {
    console.error("Unable to load cuisine meals", error);
    if (mealStatus) {
      mealStatus.textContent = "Unable to load the cuisine meals.";
    }
  }
}

function setupMealCuisines() {
  const cuisineContainer = document.querySelector("#cuisines");
  if (!cuisineContainer) {
    return;
  }
  cuisineContainer.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-cuisine]");
    if (!button) {
      return;
    }
    const cuisine = button.dataset.cuisine;

    await loadMealsByCuisine(cuisine);
  });
}

async function loadRandomMeal() {
  const mealStatus = document.querySelector("#mealStatus");

  try {
    if (mealStatus) {
      mealStatus.textContent = "Finding a random meal";
    }
    const data = await getRandomMeal();

    if (!data.meals || data.meals.length === 0) {
      if (mealStatus) {
        mealStatus.textContent = "Unable to find a random meal.";
      }
      return;
    }
    displayMeals(data.meals);

    if (mealStatus) {
      mealStatus.textContent = "Random meal found.";
    }
  } catch (error) {
    console.error("Unable to random meal:", error);
    if (mealStatus) {
      mealStatus.textContent = "Unable to load random meal.";
    }
  }
}
function setupRandomMeal() {
  const randomMealButton = document.querySelector("#randomMealButton");

  if (!randomMealButton) {
    return;
  }
  randomMealButton.addEventListener("click", async () => {
    await loadRandomMeal();
  });
}

export function displayFavoriteMeals() {
  const favoriteResults = document.querySelector("#favoriteMealResults");

  if (!favoriteResults) {
    return;
  }
  const favorites = getFavoriteMeals();
  favoriteResults.innerHTML = "";

  if (favorites.length === 0) {
    favoriteResults.innerHTML = "<p>No favorite meals yet.</p>";
    return;
  }
  favorites.forEach((favorite) => {
    const article = document.createElement("article");

    article.classList.add("meal-card");

    article.innerHTML = `
    <img
    src="${favorite.image}"
    alt="${favorite.name}"
    />

    <div class="meal-card-content">
    <h3>${favorite.name}</h3>
    <p>${favorite.category || "Meal"}</p>
    <p>${favorite.cuisine || ""}</p>
    <a
    href="recipe.html?id=${favorite.id}"
    class="view-recipe"
    >
    View Recipe
    </a>
    </div>
    `;
    favoriteResults.appendChild(article);
  });
}

export async function initializeMeals() {
  setupMealSearch();
  setupMealCategories();
  setupMealCuisines();
  setupRandomMeal();

  await searchAndDisplayMeals("Pasta");
}
