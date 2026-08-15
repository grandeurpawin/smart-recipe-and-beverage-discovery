import { getCocktailById } from "./api.mjs";
import { saveRecentlyViewed, saveFavoriteCocktail } from "./storage.mjs";

function saveCocktailFavorite(cocktail) {
  const favoriteCocktail = {
    id: cocktail.idDrink,
    name: cocktail.strDrink,
    image: cocktail.strDrinkThumb,
    category: cocktail.strCategory,
    type: cocktail.strAlcoholic,
  };

  return saveFavoriteCocktail(favoriteCocktail);
}

function setupFavoriteButton(cocktail) {
  const favoriteButton = document.querySelector("#favoriteCocktailButton");

  if (!favoriteButton) {
    return;
  }
  favoriteButton.addEventListener("click", () => {
    const saved = saveCocktailFavorite(cocktail);

    if (saved) {
      favoriteButton.textContent = "Added to Favorites";
      favoriteButton.setAttribute("aria-pressed", "true");
    } else {
      favoriteButton.textContent = "Already in Favorites";
      favoriteButton.setAttribute("aria-pressed", "true");
    }
  });
}

async function loadCocktail() {
  const urlParams = new URLSearchParams(window.location.search);

  const cocktailId = urlParams.get("id");

  console.log("Cocktail ID:", cocktailId);

  if (!cocktailId) {
    console.error("No cocktail was selected.");
    return;
  }

  try {
    const data = await getCocktailById(cocktailId);
    console.log("Cocktail data:", data);

    if (!data.drinks || data.drinks.length === 0) {
      console.error("Cocktail not found.");
      return;
    }
    const cocktail = data.drinks[0];

    saveRecentlyViewed({
      id: cocktail.idDrink,
      name: cocktail.strDrink,
      image: cocktail.strDrinkThumb,
      type: "cocktail",
    });

    console.log("Cocktail", cocktail);

    document.querySelector("#cocktailTitle").textContent = cocktail.strDrink;
    document.querySelector("#cocktailCategory").textContent =
      cocktail.strCategory || "Cocktail";
    document.querySelector("#cocktailType").textContent =
      cocktail.strAlcoholic || "";
    document.querySelector("#cocktailGlass").textContent =
      cocktail.strGlass || "";
    const cocktailImage = document.querySelector("#cocktailImage");

    cocktailImage.src = cocktail.strDrinkThumb;
    cocktailImage.alt = cocktail.strDrink;

    displayCocktailIngredients(cocktail);
    displayCocktailInstructions(cocktail);
    setupFavoriteButton(cocktail);
  } catch (error) {
    console.error("Unable to load cocktail:", error);
  }
}

function displayCocktailIngredients(cocktail) {
  const ingredientList = document.querySelector("#cocktailIngredientsList");
  if (!ingredientList) {
    return;
  }
  ingredientList.innerHTML = "";
  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}`];
    const measure = cocktail[`strMeasure${i}`];

    if (!ingredient || ingredient.trim() === "") {
      continue;
    }

    const listItem = document.createElement("li");

    listItem.textContent = `${measure || ""} ${ingredient}`.trim();
    ingredientList.appendChild(listItem);
  }
}

function displayCocktailInstructions(cocktail) {
  const instructionsContainer = document.querySelector("#cocktailInstructions");

  if (!instructionsContainer) {
    return;
  }
  instructionsContainer.innerHTML = "";

  const instructions = cocktail.strInstructions
    .split(/\r?\n/)
    .map((instruction) => instruction.trim())
    .filter((instruction) => instruction !== "");

  instructions.forEach((instruction) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = instruction;

    instructionsContainer.appendChild(paragraph);
  });
}

export function initializeCocktail() {
  loadCocktail();
}
