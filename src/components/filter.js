import AbstractComponent from "./abstract-component";

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

const generateFilters = (films) => {
  return filterNames.map((filter) => {
    return {
      title: filter,
      count: getFilmsAmountByFilter(filter, films),
    };
  });
};

const getFilterTemplate = (filters) => {
  const noFilterTitle = filters[0].title;
  const filtersMarkup = filters.slice(1).map((filter) => {
    const {title, count} = filter;
    return (
      `<a href="#${title.toLowerCase()}" class="main-navigation__item main-navigation__item--">${title}
        <span class="main-navigation__item-count">${count}</span>
      </a>`
    );
  })
  .join(`\n`);
  return (
    `<div class="main-navigation__items">
      <a href="#${noFilterTitle}" class="main-navigation__item main-navigation__item--active">${noFilterTitle} movies</a>
      ${filtersMarkup}
    </div>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(films) {
    super();
    this._filters = generateFilters(films);
  }

  getTemplate() {
    return getFilterTemplate(this._filters);
  }
}
