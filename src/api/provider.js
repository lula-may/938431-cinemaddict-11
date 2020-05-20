export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getMovies() {
    return this._api.getMovies();
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
