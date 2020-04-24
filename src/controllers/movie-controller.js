import CardComponent from "../components/card.js";
import FilmDetailsComponent from "../components/film-details.js";
import {render, remove} from "../utils/render.js";

export default class MovieController {
  constructor(container, popupContainer) {
    this._container = container;
    this._popupContainer = popupContainer;
    this._cardComponent = null;
    this._filmDetailsComponent = null;
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
    this._cardComponent = new CardComponent(movie);
    this._filmDetailsComponent = new FilmDetailsComponent(movie);

    render(this._container, this._cardComponent);
    this._cardComponent.setClickHandlers(() => {
      this._openPopup();
    });
  }
}
