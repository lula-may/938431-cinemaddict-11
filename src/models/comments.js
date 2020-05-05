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

  addComment(comment) {
    this._comments.push(comment);
    this._callHandlers(this._dataChangeHandlers);
  }

  removeComment(id) {
    const index = this._comments.findIndex((comment) => {
      return comment.id === id;
    });

    if (index === -1) {
      return false;
    }
    this._comments = [].concat(this._comments.slice(0, index), this._comments.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
