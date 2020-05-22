import MovieModel from "../models/movie.js";

const isOnline = () => {
  return window.navigator.onLine;
};

const createStorageStructure = (items) => {
  return items.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
};

export default class Provider {
  constructor(api, storage) {
    this._api = api;
    this._storage = storage;
    this._syncIsNeeded = false;
  }

  get syncIsNeeded() {
    return this._syncIsNeeded;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
      .then((movies) => {
        const unitedMovies = createStorageStructure(movies.map((movie) => movie.convertToRaw()));
        this._storage.setItems(unitedMovies);
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
    this._syncIsNeeded = true;
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

  sync() {
    if (isOnline()) {
      const storedMovies = Object.values(this._storage.getItems());

      return this._api.sync(storedMovies)
        .then((response) => {
          const updatedMovies = createStorageStructure(response.updated);
          this._storage.setItems(updatedMovies);
          this._syncIsNeeded = false;
        });
    }
    return Promise.reject(`Sync data failed`);
  }
}
