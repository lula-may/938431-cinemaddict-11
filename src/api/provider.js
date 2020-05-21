import MovieModel from "../models/movie.js";

const isOnline = () => {
  return window.navigator.onLine;
};

const createStorageStructure = (items) => {
  return items.reduce((acc, item) => {
    acc[item.id] = item.convertToRaw();
    return acc;
  }, {});
};

export default class Provider {
  constructor(api, storage) {
    this._api = api;
    this._storage = storage;
    this._isSyncNeeded = false;
  }

  get isSyncNeeded() {
    return this._isSyncNeeded;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
      .then((movies) => {
        const unitedMovies = createStorageStructure(movies);
        this._storage.setItem(unitedMovies);
        return movies;
      });
    }
    const storedMovies = Object.values(this._storage.getItems());
    return Promise.resolve(MovieModel.parseMovies(storedMovies));
  }

  updateMovie(id, movie) {
    if (isOnline()) {
      return this._api.updateMovie(id, movie)
        .then((newMovie) => {
          this._storage.setItem(newMovie.id, newMovie.convertToRaw());
          return newMovie;
        });
    }
    const localMovie = MovieModel.clone(Object.assign(movie, {id}));
    this._storage.setItem(id, localMovie.convertToRaw());
    this._isSyncNeeded = true;
    return Promise.resolve(localMovie);
  }

  getComments(id) {
    return this._api.getComments(id);
  }

  addComment(id, comment) {
    return this._api.addComment(id, comment);
  }

  deleteComment(id) {
    return this._api.deleteComment(id);
  }
}
