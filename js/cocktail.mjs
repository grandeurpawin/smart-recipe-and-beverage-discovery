import { searchCocktailsByName, getRandomCocktail } from "./api.mjs";
import { getFavoriteCocktails } from "./storage.mjs";

function createCocktailCard(cocktail) {
  const article = document.createElement("article");

  article.classList.add("cocktail-card");

  article.innerHTML = `
    <img 
    src="${cocktail.strDrinkThumb}"
    alt="${cocktail.strDrink}"
    >

    <div class="cocktail-card-content">
    <h3>${cocktail.strDrink}</h3>
    <p>${cocktail.strCategory || "Cocktail"}</p>

    <a
    href="cocktail.html?id=${cocktail.idDrink}"
    class="view-cocktail" 
    >
    View Drink
    </a>
    </div>
    `;
  return article;
}

function displayCocktails(cocktails) {
  const cocktailResults = document.querySelector("#cocktailResults");

  if (!cocktailResults) {
    return;
  }
  cocktailResults.innerHTML = "";

  cocktails.forEach((cocktail) => {
    const cocktailCard = createCocktailCard(cocktail);

    cocktailResults.appendChild(cocktailCard);
  });
}

export async function searchAndDisplayCocktails(cocktailName) {
  const cocktailStatus = document.querySelector("#cocktailStatus");

  try {
    if (cocktailStatus) {
      cocktailStatus.textContent = "Searching for drinks...";
    }
    const data = await searchCocktailsByName(cocktailName);
    if (!data.drinks) {
      displayCocktails([]);
      if (cocktailStatus) {
        cocktailStatus.textContent = "No drinks found.";
      }
      return;
    }
    displayCocktails(data.drinks);

    if (cocktailStatus) {
      cocktailStatus.textContent = `${data.drinks.length} drink(s) found.`;
    }
  } catch (error) {
    console.error("Unable to load cocktails:", error);

    if (cocktailStatus) {
      cocktailStatus.textContent = "Unable to load drinks. Please try again.";
    }
  }
}

function setupCocktailSearch() {
  const searchForm = document.querySelector("#cocktailSearchForm");
  const searchInput = document.querySelector("#cocktailSearch");

  if (!searchForm || !searchInput) {
    return;
  }
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const cocktailName = searchInput.value.trim();

    if (!cocktailName) {
      return;
    }
    await searchAndDisplayCocktails(cocktailName);
  });
}

async function loadRandomCocktail() {
  const cocktailStatus = document.querySelector("#cocktailStatus");

  try {
    if (cocktailStatus) {
      cocktailStatus.textContent = "Finding a random drink...";
    }
    const data = await getRandomCocktail();

    if (!data.drinks || data.drinks.length === 0) {
      if (cocktailStatus) {
        cocktailStatus.textContent = "Unable to find a random drink.";
      }
      return;
    }
    displayCocktails(data.drinks);

    if (cocktailStatus) {
      cocktailStatus.textContent = "Random drink found.";
    }
  } catch (error) {
    console.error("Unable to load random cocktail:", error);

    if (cocktailStatus) {
      cocktailStatus.textContent =
        "Unable to load random drink. Please try again.";
    }
  }
}

function setupRandomCocktail() {
  const randomCocktailButton = document.querySelector("#randomCocktailButton");

  if (!randomCocktailButton) {
    return;
  }
  randomCocktailButton.addEventListener("click", async () => {
    await loadRandomCocktail();
  });
}

export function displayFavoriteCocktails() {
  const favoriteResults = document.querySelector("#favoriteCocktailResults");
  if (!favoriteResults) {
    return;
  }
  const favorites = getFavoriteCocktails();

  favoriteResults.innerHTML = "";

  if (favorites.length === 0) {
    favoriteResults.innerHTML = "<p>No favorite drinks yet.</p>";
    return;
  }
  favorites.forEach((favorite) => {
    const article = document.createElement("article");

    article.classList.add("cocktail-card");

    article.innerHTML = `
    <img
    src="${favorite.image}"
    alt="${favorite.name}"
    />

    <div class="cocktail-card-content">
    <h3>${favorite.name}</h3>
    <p>${favorite.category || "Cocktail"}</p>
    <p>${favorite.type || ""}</p>

    <a
    href="cocktail.html?id=${favorite.id}"
    class="view-cocktail"
    >
    View Drink
    </a>
    </div>
    `;
    favoriteResults.appendChild(article);
  });
}

export async function initializeCocktails() {
  setupCocktailSearch();
  setupRandomCocktail();
await searchAndDisplayCocktails("Grape")
}
