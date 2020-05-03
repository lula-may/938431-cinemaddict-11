import AbstractComponent from "./abstract-component";

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
  constructor(filters) {
    super();
    this._filters = filters;
    this._filterChangeHandlers = [];
  }

  getTemplate() {
    return getFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }
}
