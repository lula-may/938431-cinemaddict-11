import {formatDate} from "../utils/common.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import {createElement} from "../utils/render.js";
import {EMOTIONS} from "../utils/const.js";

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

const getCommentDateText = (date) => {
  switch (new Date().getDate() - date.getDate()) {
    case 0: return `Today`;
    case 1: return `Yesderday`;
    default: return formatDate(date);
  }
};

const getCommentsMarkup = (items) => {
  return items.
    map((item) => {
      const {emotion, date, text, author} = item;
      const commentDate = getCommentDateText(date);
      const commentText = (!text) ? `` : text;
      return (
        `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
          </span>
          <div>
            <p class="film-details__comment-text">${commentText}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${commentDate}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`
      );
    })
    .join(`\n`);
};

const getEmojiListMarkup = () => {
  return EMOTIONS.map((emotion) => {
    return (
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
      <label class="film-details__emoji-label" for="emoji-${emotion}">
        <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
      </label>`
    );
  }).join(`\n`);
};

const getFilmDetailsTemplate = (film) => {
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
    comments,
  } = film;
  const formatReleaseDate = date.toLocaleString(`en-GB`, {day: `numeric`, month: `long`, year: `numeric`});
  const activeControls = {
    [`watchlist`]: isInWatchlist,
    [`watched`]: isInHistory,
    [`favorite`]: isFavorite,
  };

  const controlsMarkup = getControllsMarkup(activeControls);
  const genreText = (genres.length > 1) ? `Genres` : `Genre`;
  const genreMarkup = getGenresMarkup(genres);
  const commentsMarkup = getCommentsMarkup(comments);
  const emojiListMarkup = getEmojiListMarkup();

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

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
                  <td class="film-details__cell">${formatReleaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
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
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
            ${commentsMarkup}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
              ${emojiListMarkup}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
    this._closeClickHandler = null;
    this._watchlistHandler = null;
    this._watchedHandler = null;
    this._favoriteHandler = null;
    this._comments = this._film.comments;
    this._newComment = {};
    this._subscribeOnEvents();
  }

  getTemplate() {
    return getFilmDetailsTemplate(this._film);
  }

  setCloseButtonClickHandler(handler) {
    const closeButtonElement = this.getElement().querySelector(`.film-details__close-btn`);
    closeButtonElement.addEventListener(`click`, handler);
    this._closeClickHandler = handler;
  }

  setToWatchlistButtonChangeHandler(handler) {
    this.getElement().querySelector(`#watchlist`).addEventListener(`change`, handler);
    this._watchlistHandler = handler;
  }

  setWatchedButtonChangeHandler(handler) {
    this.getElement().querySelector(`#watched`).addEventListener(`change`, handler);
    this._watchedHandler = handler;
  }

  setFavoriteButtonChangeHandler(handler) {
    this.getElement().querySelector(`#favorite`).addEventListener(`change`, handler);
    this._favoriteHandler = handler;
  }

  _renderCommentEmoji(emotion) {
    const template = `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">`;
    const emojiContainer = this.getElement().querySelector(`.film-details__add-emoji-label`);
    emojiContainer.innerHTML = ``;
    const emojiElement = createElement(template);
    emojiContainer.append(emojiElement);
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    // Навешиваем обработчик клика по эмоджи
    element.querySelector(`.film-details__emoji-list`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      const emotion = evt.target.value;
      this._renderCommentEmoji(emotion);
      this._newComment.emotion = emotion;
    });

    // Обработчик ввода текста комментария
    element.querySelector(`.film-details__comment-input`).addEventListener(`change`, (evt) => {
      this._newComment.text = evt.target.value;
    });

    // Обработчик нажатия Ctrl/Command + Enter для отправки комментария
    element.querySelector(`.film-details__inner`).addEventListener(`keydown`, (evt) => {
      if (!((evt.ctrlKey || evt.metaKey) && evt.key === `Enter`) || !this._newComment.emotion) {
        return;
      }
      this._newComment.date = new Date();
      this._comments.push(this._newComment);
      this._newComment = {};
      this.rerender();
    });
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeClickHandler);
    this.setToWatchlistButtonChangeHandler(this._watchlistHandler);
    this.setWatchedButtonChangeHandler(this._watchedHandler);
    this.setFavoriteButtonChangeHandler(this._favoriteHandler);
    this._subscribeOnEvents();
  }

  reset() {
    this._comments = this._film.comments;
    this._newComment = {};
    this.rerender();
  }
}
