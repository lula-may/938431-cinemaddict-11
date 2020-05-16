import {formatReleaseDate, formatRunTime} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

const ControlIdToText = {
  [`watchlist`]: `Add to watchlist`,
  [`watched`]: `Already watched`,
  [`favorite`]: `Add to favorites`,
};


const getGenresMarkup = (items) => {
  return items
    .map((item) => `<span class="film-details__genre">${item}</span>`)
    .join(`\n`);
};

const getControllsMarkup = (activeControls) => {
  const controls = Object.keys(ControlIdToText);
  return controls.map((id) => {
    const isActive = activeControls[id];

    return (
      `<input type="checkbox" class="film-details__control-input visually-hidden" id="${id}" name="${id}" ${isActive ? `checked` : ``}>
      <label for="${id}" class="film-details__control-label film-details__control-label--${id}">${ControlIdToText[id]}</label>`
    );
  }).join(`\n`);
};

const getFilmDetailsMarkup = (film) => {
  const {
    title,
    originalTitle,
    poster,
    director,
    writers,
    actors,
    date,
    duration,
    description,
    country,
    genres,
    rating,
    age,
    isInWatchlist,
    isFavorite,
    isInHistory,
  } = film;

  const releaseDate = formatReleaseDate(date);
  const runTime = formatRunTime(duration);
  const activeControls = {
    [`watchlist`]: isInWatchlist,
    [`watched`]: isInHistory,
    [`favorite`]: isFavorite,
  };

  const controlsMarkup = getControllsMarkup(activeControls);
  const genreText = (genres.length > 1) ? `Genres` : `Genre`;
  const genreMarkup = getGenresMarkup(genres);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${poster}" alt="">

              <p class="film-details__age">${age}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${originalTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${runTime}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genreText}</td>
                  <td class="film-details__cell">
                    ${genreMarkup}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
          ${controlsMarkup}
          </section>
        </div>

        <div class="form-details__bottom-container">
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetails extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return getFilmDetailsMarkup(this._film);
  }

  setCloseButtonClickHandler(handler) {
    const closeButtonElement = this.getElement().querySelector(`.film-details__close-btn`);
    closeButtonElement.addEventListener(`click`, handler);
  }

  setToWatchlistButtonChangeHandler(handler) {
    this.getElement().querySelector(`#watchlist`).addEventListener(`change`, handler);
  }

  setWatchedButtonChangeHandler(handler) {
    this.getElement().querySelector(`#watched`).addEventListener(`change`, handler);
  }

  setFavoriteButtonChangeHandler(handler) {
    this.getElement().querySelector(`#favorite`).addEventListener(`change`, handler);
  }
}
