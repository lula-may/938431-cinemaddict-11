import CardComponent from "../components/card.js";
import CommentComponent from "../components/comment.js";
import FilmDetailsComponent from "../components/film-details.js";
import {render, replace, remove} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class MovieController {
  constructor(container, popupContainer, commentsModel, onDataChange, onViewChange, onCommentsDataChange) {
    this._container = container;
    this._popupContainer = popupContainer;
    this._cardComponent = null;
    this._filmDetailsComponent = null;
    this._mode = Mode.DEFAULT;
    this._updatedFilmDetailsComponent = null;
    this._commentsModel = commentsModel;
    this._commentComponents = [];
    this._movie = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onCommentsDataChange = onCommentsDataChange;
    this._onEscPress = this._onEscPress.bind(this);
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
  }

  _openPopup() {
    this._onViewChange();
    render(this._popupContainer, this._filmDetailsComponent);
    this._mode = Mode.POPUP;
    document.addEventListener(`keydown`, this._onEscPress);

    // Отрисовываем комментарии и навешиваем обработчики
    this._renderComments();
    this._setPopupHandlers(this._movie);
  }

  _closePopup() {
    remove(this._filmDetailsComponent);
    if (this._updatedFilmDetailsComponent) {
      this._filmDetailsComponent = this._updatedFilmDetailsComponent;
      this._updatedFilmDetailsComponent = null;
    }
    this._filmDetailsComponent.reset();
    this._mode = Mode.DEFAULT;
    this._commentComponents.forEach((component) => remove(component));
  }

  _onEscPress(evt) {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      this._closePopup();
      document.removeEventListener(`keydown`, this._onEscPress);
    }
  }

  _onCloseButtonClick() {
    this._closePopup();
    document.removeEventListener(`keydown`, this._onEscPress);
  }

  _setPopupHandlers() {
    this._filmDetailsComponent.setToWatchlistButtonChangeHandler(() => {
      this._onDataChange(this._movie, Object.assign({}, this._movie, {isInWatchlist: !this._movie.isInWatchlist}));
    });

    this._filmDetailsComponent.setWatchedButtonChangeHandler(() => {
      this._onDataChange(this._movie, Object.assign({}, this._movie, {isInHistory: !this._movie.isInHistory}));
    });

    this._filmDetailsComponent.setFavoriteButtonChangeHandler(() => {
      this._onDataChange(this._movie, Object.assign({}, this._movie, {isFavorite: !this._movie.isFavorite}));
    });

    this._filmDetailsComponent.setCloseButtonClickHandler(this._onCloseButtonClick);
  }

  _renderComments() {
    const commentsContainer = this._filmDetailsComponent.getElement().querySelector(`.film-details__comments-list`);
    this._commentComponents.forEach((comment) => {
      render(commentsContainer, comment);
      comment.setDeleteButtonClickHandler(() => {
        this._onCommentsDataChange(this._movie, comment.getComment(), null);
      });
    });
  }

  render(movie) {
    this._movie = movie;
    this._renderCard();
    this._createFilmDetailsComponent();
  }

  _renderCard() {
    const movie = this._movie;
    const oldCardComponent = this._cardComponent;
    this._cardComponent = new CardComponent(movie);

    if (oldCardComponent) {
      replace(this._cardComponent, oldCardComponent);
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
  }

  _createFilmDetailsComponent() {
    const movie = this._movie;
    const oldFilmDetailsComponent = this._filmDetailsComponent;
    const filmComments = this._commentsModel.getCommentsByIds(movie.comments);
    this._commentComponents = filmComments.map((comment) => {
      return new CommentComponent(comment);
    });
    this._updatedFilmDetailsComponent = new FilmDetailsComponent(movie, this._commentComponents, this._onCommentsDataChange);

    if (!oldFilmDetailsComponent || this._mode === Mode.DEFAULT) {
      this._filmDetailsComponent = this._updatedFilmDetailsComponent;
      this._updatedFilmDetailsComponent = null;
    }
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
