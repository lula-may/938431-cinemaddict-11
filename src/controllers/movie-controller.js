import CardComponent from "../components/card.js";
import CommentComponent from "../components/comment.js";
import FilmDetailsComponent from "../components/film-details.js";
import {render, replace, remove} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class MovieController {
  constructor(container, popupContainer, commentsModel, onDataChange, onViewChange, onCommentsDatachange) {
    this._container = container;
    this._popupContainer = popupContainer;
    this._cardComponent = null;
    this._filmDetailsComponent = null;
    this._mode = Mode.DEFAULT;
    this._commentsModel = commentsModel;
    this._commentComponents = [];
    this._movie = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onCommentsDataChange = onCommentsDatachange;
    this._onEscPress = this._onEscPress.bind(this);
    // this._onCommentsDataChange = this._onCommentsDataChange.bind(this);
  }

  _openPopup() {
    this._onViewChange();
    render(this._popupContainer, this._filmDetailsComponent);
    this._mode = Mode.POPUP;
    this._filmDetailsComponent.setCloseButtonClickHandler(() => {
      this._closePopup();
      document.removeEventListener(`keydown`, this._onEscPress);
    });
    document.addEventListener(`keydown`, this._onEscPress);
    // Отрисовываем комментарии
    this._renderComments();
    this._filmDetailsComponent.setFormSubmitHandler(this._onCommentDataChange);
    this._setPopupControlHandlers(this._movie);
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

  _setPopupControlHandlers() {
    this._filmDetailsComponent.setToWatchlistButtonChangeHandler(() => {
      this._onDataChange(this._movie, Object.assign({}, this._movie, {isInWatchlist: !this._movie.isInWatchlist}));
    });

    this._filmDetailsComponent.setWatchedButtonChangeHandler(() => {
      this._onDataChange(this._movie, Object.assign({}, this._movie, {isInHistory: !this._movie.isInHistory}));
    });

    this._filmDetailsComponent.setFavoriteButtonChangeHandler(() => {
      this._onDataChange(this._movie, Object.assign({}, this._movie, {isFavorite: !this._movie.isFavorite}));
    });

  }

  _renderComments() {
    const commentsContainer = this._filmDetailsComponent.getElement().querySelector(`.film-details__comments-list`);
    this._commentComponents.forEach((comment) => {
      render(commentsContainer, comment);
      comment.setDeleteButtonClickHandler(() => {
        this._onCommentsDataChange(this._movie, comment.getComment(), null);
        remove(comment);
      });
    });
  }

  render(movie) {
    this._movie = movie;
    const oldCardComponent = this._cardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;
    const filmComments = this._commentsModel.getCommentsByIds(movie.comments);
    this._cardComponent = new CardComponent(movie);
    this._commentComponents = filmComments.map((comment) => {
      return new CommentComponent(comment);
    });
    this._filmDetailsComponent = new FilmDetailsComponent(movie, this._commentComponents);

    if (oldCardComponent && oldFilmDetailsComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
      this._renderComments();
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
    if (this._movie.id !== id) {
      return;
    }
    this.render(newData);
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._filmDetailsComponent);
    this._commentComponents.forEach((comment) => remove(comment));
    document.removeEventListener(`keydown`, this._onEscPress);
  }

  setDefaultView() {
    if (this._mode === Mode.DEFAULT) {
      return;
    }
    this._closePopup();
  }
}
