import AbstractComponent from "./abstract-component.js";

export const SortType = {
  DEFAULT: `default`,
  BY_DATE: `date`,
  BY_RATING: `rating`,
};

const ACTIVE_CLASS = `sort__button--active`;

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    const isActiveSort = (sortType) => sortType === this._currentSortType;

    const getSortListMarkup = () => {
      const names = Object.values(SortType);
      return names.map((sortName) => {
        const isActiveClass = isActiveSort(sortName);
        return (
          `<li><a href="#" class="sort__button ${isActiveClass ? `${ACTIVE_CLASS}` : ``}" id="${sortName}">
            Sort by ${sortName}</a></li>`
        );
      })
      .join(`\n`);
    };

    const sortListMarkup = getSortListMarkup();

    return (
      `<ul class="sort">
        ${sortListMarkup}
      </ul>`
    );
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortType(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._updateActiveSort(sortType);
  }

  _updateActiveSort(sortType) {
    const element = this.getElement();
    const oldSortElement = element.querySelector(`#${this._currentSortType}`);
    this._currentSortType = sortType;
    const newSortElement = element.querySelector(`#${sortType}`);
    oldSortElement.classList.remove(ACTIVE_CLASS);
    newSortElement.classList.add(ACTIVE_CLASS);
  }


  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      const sortType = evt.target.id;
      if (sortType === this._currentSortType) {
        return;
      }

      this.setSortType(sortType);
      handler(sortType);
    });
  }
}
