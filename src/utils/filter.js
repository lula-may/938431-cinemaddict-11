import {FilterType} from "../const.js";

const FilterToFlag = {
  [FilterType.ALL]: ``,
  [FilterType.WATCHLIST]: `isInWatchlist`,
  [FilterType.HISTORY]: `isInHistory`,
  [FilterType.FAVORITES]: `isFavorite`
};

const getFilmsByFilter = (filter, films) => {
  const property = FilterToFlag[filter];
  if (!property) {
    return films;
  }
  return films.filter((film) => film[property]);
};

export {getFilmsByFilter};
