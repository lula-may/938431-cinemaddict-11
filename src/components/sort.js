import AbstractComponent from "./abstract-component.js";

const SortType = {
  DEFAULT: `default`,
  BY_DATE: `by date`,
  BY_RATING: `by rating`,
};

const ACTIVE_CLASS = `sort__button--active`;

const changeActiveClassElement = (oldElement, newElement) => {
  oldElement.classList.remove(ACTIVE_CLASS);
  newElement.classList.add(ACTIVE_CLASS);
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortType.DEFAULT;
    this._currentActiveSortElement = this.getElement().querySelector(`.${ACTIVE_CLASS}`);
  }

  getTemplate() {
    return (
      `<ul class="sort">
        <li><a href="#" class="sort__button ${ACTIVE_CLASS}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
        <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
        <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
      </ul>`
    );
  }

  setActiveSortElement(element) {
    this._currentActiveSortElement = element;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      const newActiveElement = evt.target;
      let sortType = newActiveElement.dataset.sortType;
      if (sortType === this._currentSortType) {
        return;
      }

      changeActiveClassElement(this._currentActiveSortElement, newActiveElement);
      this.setActiveSortElement(newActiveElement);
      this._currentSortType = sortType;
      handler(sortType);
    });
  }
}
