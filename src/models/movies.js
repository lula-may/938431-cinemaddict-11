import {FilterType} from "../const.js";
import {getFilmsByFilter} from "../utils/filter.js";

export default class Movies {
  constructor() {
    this._movies = [];
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
    this._activeFilterType = FilterType.ALL;
  }

  getAllMovies() {
    return this._movies;
  }

  getMovies() {
    return getFilmsByFilter(this._activeFilterType, this._movies);
  }

  setMovies(movies) {
    this._movies = Array.from(movies);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateMovie(id, movie) {
    const index = this._movies.findIndex((film) => film.id === id);

    if (index === -1) {
      return false;
    }

    this._movies = [].concat(this._movies.slice(0, index), movie, this._movies.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
