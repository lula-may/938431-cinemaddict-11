const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, storage) {
    this._api = api;
    this._storage = storage;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
      .then((movies) => {
        movies.forEach((movie) => this._storage.setItem(movie.id, movie.convertToRaw()));
        return movies;
      });
    }
    return Promise.reject(`Offline logic is not implemented`);
  }

  updateMovie(id, data) {
    return this._api.updateMovie(id, data);
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
