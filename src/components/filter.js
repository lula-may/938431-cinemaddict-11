import AbstractComponent from "./abstract-component";
import {FilterType} from "../const.js";

const FILTER_PREFIX = `filter__`;

const getFilterNameById = (id) => id.replace(FILTER_PREFIX, ``);

const getFilterText = (filterType) => {
  if (filterType === FilterType.ALL) {
    return `All movies`;
  } else {
    return filterType;
  }
};

const getFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((filter) => {
    const {title, count, checked} = filter;
    const text = getFilterText(title);
    const isDefaultFilter = title === FilterType.ALL;
    return (
      `<a href="#${title}" class="main-navigation__item
        ${checked ? `main-navigation__item--active` : ``}" id="filter__${title}">${text}
        ${isDefaultFilter ? `` : `<span class="main-navigation__item-count">${count}</span>`}
      </a>`
    );
  })
  .join(`\n`);
  return (
    `<div class="main-navigation__items">
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

  updateActiveFilter(filterName) {
    const oldActiveItem = this.getElement().querySelector(`.main-navigation__item--active`);
    oldActiveItem.classList.remove(`main-navigation__item--active`);
    const newActiveItem = this.getElement().querySelector(`#filter__${filterName}`);
    if (newActiveItem) {
      newActiveItem.classList.add(`main-navigation__item--active`);
    }
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
