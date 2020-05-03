export default class Comments {
  constructor() {
    this._comments = [];
    this._dataChangeHandlers = [];
  }

  getComments() {
    return this._comments;
  }

  getCommentsByIds(ids) {
    return ids.map((id) => {
      return this._comments.find((item) => item.id === id);
    });
  }

  setComments(comments) {
    this._comments = comments;
    this._callHandlers(this._dataChangeHandlers);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
