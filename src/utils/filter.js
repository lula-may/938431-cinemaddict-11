const FilterToFlag = {
  [`All`]: ``,
  [`Watchlist`]: `isInWatchlist`,
  [`History`]: `isInHistory`,
  [`Favorites`]: `isFavorite`
};

const getFilmsByFilter = (filter, films) => {
  const property = FilterToFlag[filter];
  if (!property) {
    return films;
  }
  return films.filter((film) => film[property]);
};

export {getFilmsByFilter};
