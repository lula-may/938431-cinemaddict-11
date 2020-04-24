import AbstractComponent from "./abstract-component.js";

const MAX_DESCRIPTION_LENGTH = 140;
const getCardTemplate = (film) => {
  const {title, poster, date, rating, duration, genres, description, comments} = film;
  const year = date.getFullYear();
  const genre = genres.join(` `);
  const descriptionPreview = description.length > MAX_DESCRIPTION_LENGTH ?
    `${description.slice(0, MAX_DESCRIPTION_LENGTH)}...`
    : description;

  const isInWatchlist = film.isInWatchlist;
  const isWatched = film.isInHistory;
  const isFavorite = film.isFavorite;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${descriptionPreview}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item${isInWatchlist ? `` : `--active`} button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item${isWatched ? `` : `--active`} button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item${isFavorite ? `` : `--active`} button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class Card extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return getCardTemplate(this._film);
  }

  setClickHandlers(handler) {
    const poster = this.getElement().querySelector(`.film-card__poster`);
    const title = this.getElement().querySelector(`.film-card__title`);
    const comment = this.getElement().querySelector(`.film-card__comments`);

    poster.addEventListener(`click`, handler);
    title.addEventListener(`click`, handler);
    comment.addEventListener(`click`, handler);
  }
}
