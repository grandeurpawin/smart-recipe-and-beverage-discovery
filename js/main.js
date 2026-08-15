import { initializeMeals, displayFavoriteMeals } from "./meals.mjs";
import { initializeCocktails, displayFavoriteCocktails } from "./cocktail.mjs";
import { initializeRecipe } from "./recipe.js";
import { initializeCocktail } from "./cocktail.js";
import { getRecentlyViewed } from "./storage.mjs";

const currentPage = document.body.dataset.page;

if (currentPage === "home") {
  initializeMeals();
  initializeCocktails();
  displayFavoriteCocktails();
  displayFavoriteMeals();
  displayRecentlyViewed();
}

if (currentPage === "recipe") {
  initializeRecipe();
}

if (currentPage === "cocktail") {
  initializeCocktail();
}

function displayRecentlyViewed() {
  const recentResults = document.querySelector("#recentResults");

  if (!recentResults) {
    return;
  }
  const recentItems = getRecentlyViewed();

  recentResults.innerHTML = "";
  if (recentItems.length === 0) {
    recentResults.innerHTML = "<p>No recently viewed items yet.</p>";
    return;
  }
  recentItems.forEach((item) => {
    const article = document.createElement("article");

    article.classList.add(item.type === "meal" ? "meal-card" : "cocktail-card");
    const detailPage = item.type === "meal" ? "recipe.html" : "cocktail.html";

    article.innerHTML = `
    <img
      src="${item.image}"
      alt="${item.name}"
    />
    <div class="meal-card-content">
      <h3>${item.name}</h3>
      <a href="${detailPage}?id=${item.id}">
        View Details
      </a>
    </div>
  `;
    recentResults.appendChild(article);
  });
}

function setupMobileMenu() {
  const menuButton = document.querySelector("#menuButton");
  const navLinks = document.querySelector("#navLinks");

  if (!menuButton || !navLinks) {
    return;
  }

  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
  });
}

setupMobileMenu();