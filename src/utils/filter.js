const FilterToFlag = {
  [`All`]: ``,
  [`Watchlist`]: `isInWatchList`,
  [`History`]: `isInHistory`,
  [`Favorites`]: `isFavorite`
};

const getFilmsByFilter = (filter, films) => {
  const property = FilterToFlag[filter];
  return films.filter((film) => film[property]);
};

export {getFilmsByFilter};
