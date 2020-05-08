import FilterComponent from "../components/filter.js";
import {FilterType} from "../const.js";
import {getFilmsByFilter} from "../utils/filter.js";
import {render, replace, RenderPosition} from "../utils/render.js";

export default class Filter {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const allMovies = this._moviesModel.getAllMovies();
    const filters = this._generateFilters(allMovies);
    const oldComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(this._container, this._filterComponent, RenderPosition.AFTERBEGIN);
    }
  }

  setActiveFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterComponent.updateActiveFilter(filterType);
  }

  _generateFilters(films) {
    return Object.values(FilterType).map((filter) => {
      return {
        title: filter,
        count: getFilmsByFilter(filter, films).length,
        checked: filter === this._activeFilterType,
      };
    });
  }

  _onFilterChange(filterType) {
    if (filterType === this._activeFilterType) {
      return;
    }
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this._filterComponent.updateActiveFilter(filterType);
  }

  _onDataChange() {
    this.render();
  }
}
