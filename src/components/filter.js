const filterNames = [`All`, `Watchlist`, `History`, `Favorites`];
const FilterToFlag = {
  [`All`]: ``,
  [`Watchlist`]: `isInWatchList`,
  [`History`]: `isInHistory`,
  [`Favorites`]: `isFavorite`
};

const getFilmsAmountByFilter = (filter, films) => {
  return FilterToFlag[filter] ?
    films.reduce((acc, film) => {
      if (film[FilterToFlag[filter]]) {
        acc++;
      }
      return acc;
    }, 0)
    : ``;
};

export const generateFilters = (films) => {
  return filterNames.map((filter) => {
    return {
      title: filter,
      count: getFilmsAmountByFilter(filter, films),
    };
  });
};
