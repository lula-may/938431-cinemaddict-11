import CardComponent from "../components/card.js";
import FilmDetailsComponent from "../components/film-details.js";
import {render, replace, remove} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class MovieController {
  constructor(container, popupContainer, onDataChange, onViewChange) {
    this._container = container;
    this._popupContainer = popupContainer;
    this._cardComponent = null;
    this._filmDetailsComponent = null;
    this._mode = Mode.DEFAULT;
    this._comments = [];

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onEscPress = this._onEscPress.bind(this);
  }

  _openPopup(movie) {
    this._onViewChange();
    render(this._popupContainer, this._filmDetailsComponent);
    this._mode = Mode.POPUP;
    this._filmDetailsComponent.setCloseButtonClickHandler(() => {
      this._closePopup();
      document.removeEventListener(`keydown`, this._onEscPress);
    });
    document.addEventListener(`keydown`, this._onEscPress);

    this._setPopupControlHandlers(movie);
  }

  _closePopup() {
    remove(this._filmDetailsComponent);
    this._filmDetailsComponent.reset();
    this._mode = Mode.DEFAULT;
  }

  _onEscPress(evt) {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      this._closePopup();
      document.removeEventListener(`keydown`, this._onEscPress);
    }
  }

  _setPopupControlHandlers(movie) {
    this._filmDetailsComponent.setToWatchlistButtonChangeHandler(() => {
      this._onDataChange(movie, Object.assign({}, movie, {isInWatchlist: !movie.isInWatchlist}));
    });

    this._filmDetailsComponent.setWatchedButtonChangeHandler(() => {
      this._onDataChange(movie, Object.assign({}, movie, {isInHistory: !movie.isInHistory}));
    });

    this._filmDetailsComponent.setFavoriteButtonChangeHandler(() => {
      this._onDataChange(movie, Object.assign({}, movie, {isFavorite: !movie.isFavorite}));
    });

  }

  render(movie, comments) {
    this._comments = comments;
    const oldCardComponent = this._cardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;
    const filmComments = movie.comments.map((id) => {
      return comments.find((item) => item.id === id);
    });
    this._cardComponent = new CardComponent(movie);
    this._filmDetailsComponent = new FilmDetailsComponent(movie, filmComments);

    if (oldCardComponent && oldFilmDetailsComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, this._cardComponent);
    }

    this._cardComponent.setClickHandlers(() => {
      this._openPopup(movie);
    });
    this._cardComponent.setToWatchlistButtonClickHandler(() => {
      this._onDataChange(movie, Object.assign({}, movie, {isInWatchlist: !movie.isInWatchlist}));
    });

    this._cardComponent.setWatchedButtonClickHandler(() => {
      this._onDataChange(movie, Object.assign({}, movie, {isInHistory: !movie.isInHistory}));
    });

    this._cardComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(movie, Object.assign({}, movie, {isFavorite: !movie.isFavorite}));
    });

    this._setPopupControlHandlers(movie);
  }

  rerender(id, newData) {
    if (this._cardComponent.film.id !== id) {
      return;
    }
    this.render(newData, this._comments);
  }

  setDefaultView() {
    if (this._mode === Mode.DEFAULT) {
      return;
    }
    this._closePopup();
  }
}
