import Movie from "./models/movie.js";
import Comment from "./models/comment.js";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.ok) {
    return response;
  }
  throw new Error(`Статус ответа сервера: ${response.status} ${response.statusText}`);
};

export default class API {
  constructor(authorization, endPoint) {
    this._authorization = authorization;
    this._endPoint = endPoint;
  }

  getMovies() {
    return this._load({url: `movies`})
    .then((response) => response.json())
    .then(Movie.parseMovies);
  }

  updateMovie(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.convertToRaw()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Movie.parseMovie);
  }

  getComment(movieId) {
    return this._load({url: `comments/${movieId}`})
      .then((response) => response.json())
      .then(Comment.parseComments);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
