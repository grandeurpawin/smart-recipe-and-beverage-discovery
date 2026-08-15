export function getFavoriteMeals() {
  return JSON.parse(localStorage.getItem("favoriteMeals")) || [];
}

export function saveFavoriteMeal(meal) {
  const favorites = getFavoriteMeals();

  const alreadyFavorite = favorites.some((favorite) => favorite.id === meal.id);
  if (alreadyFavorite) {
    return false;
  }
  favorites.push(meal);

  localStorage.setItem("favoriteMeals", JSON.stringify(favorites));
  return true;
}

export function getFavoriteCocktails() {
  return JSON.parse(localStorage.getItem("favoriteCocktails")) || [];
}

export function saveFavoriteCocktail(cocktail) {
  const favorites = getFavoriteCocktails();

  const alreadyFavorite = favorites.some(
    (favorite) => favorite.id === cocktail.id,
  );

  if (alreadyFavorite) {
    return false;
  }
  favorites.push(cocktail);

  localStorage.setItem("favoriteCocktails", JSON.stringify(favorites));
  return true;
}

export function getRecentlyViewed() {
  return JSON.parse(localStorage.getItem("recentlyViewed")) || [];
}

export function saveRecentlyViewed(item) {
  const recentItems = getRecentlyViewed();

  const existingIndex = recentItems.findIndex(
    (recent) => recent.id === item.id && recent.type === item.type,
  );
  if (existingIndex !== -1) {
    recentItems.splice(existingIndex, 1);
  }
  recentItems.unshift(item);

  const limitedItems = recentItems.slice(0, 6);

  localStorage.setItem("recentlyViewed", JSON.stringify(limitedItems));
}
