import CardComponent from "../components/card.js";
import FilmDetailsComponent from "../components/film-details.js";
import {render, replace, remove} from "../utils/render.js";

export default class MovieController {
  constructor(container, popupContainer, onDataChange) {
    this._container = container;
    this._popupContainer = popupContainer;
    this._cardComponent = null;
    this._filmDetailsComponent = null;
    this._onDataChange = onDataChange;

    this._onEscPress = this._onEscPress.bind(this);
  }

  _openPopup() {
    render(this._popupContainer, this._filmDetailsComponent);
    this._filmDetailsComponent.setCloseButtonClickHandler(() => {
      this._closePopup();
      document.removeEventListener(`keydown`, this._onEscPress);
    });
    document.addEventListener(`keydown`, this._onEscPress);
  }

  _closePopup() {
    remove(this._filmDetailsComponent);
  }

  _onEscPress(evt) {
    evt.preventDefault();
    if (evt.key === `Escape`) {
      this._closePopup();
      document.removeEventListener(`keydown`, this._onEscPress);
    }
  }

  render(movie) {
    const oldCardComponent = this._cardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._cardComponent = new CardComponent(movie);
    this._filmDetailsComponent = new FilmDetailsComponent(movie);

    if (oldCardComponent && oldFilmDetailsComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, this._cardComponent);
    }

    this._cardComponent.setClickHandlers(() => {
      this._openPopup();
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
  }

  rerender(oldData, newData) {
    if (this._cardComponent.film !== oldData) {
      return;
    }
    this.render(newData);
  }
}
