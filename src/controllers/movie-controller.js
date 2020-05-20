import CardComponent from "../components/card.js";
import CommentsComponent from "../components/comments.js";
import FilmDetailsComponent from "../components/film-details.js";
import MovieModel from "../models/movie.js";
import CommentsModel from "../models/comments.js";
import {render, replace, remove} from "../utils/render.js";


const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class MovieController {
  constructor(container, popupContainer, onDataChange, onViewChange, onCommentsDataChange, api) {
    this._container = container;
    this._popupContainer = popupContainer;
    this._api = api;
    this._cardComponent = null;
    this._filmDetailsComponent = null;
    this._updatedFilmDetailsComponent = null;
    this._commentsComponent = null;
    this._commentComponents = [];

    this._mode = Mode.DEFAULT;
    this._commentsModel = null;
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
    const commentsContainer = this._popupContainer.querySelector(`.form-details__bottom-container`);
    this._setPopupHandlers(this._movie);
    this._createCommentsComponent();
    render(commentsContainer, this._commentsComponent);

    this._api.getComments(this._movie.id)
      .then((comments) => {
        this._commentsModel = new CommentsModel();
        this._commentsModel.setComments(comments);
        // Отрисовываем комментарии и навешиваем обработчики
        this._commentsComponent.renderComments(this._commentsModel);
      })
      .catch(() => {
        this._commentsComponent.onLoadCommentsError();
      });
  }

  _closePopup() {
    remove(this._filmDetailsComponent);
    if (this._updatedFilmDetailsComponent) {
      this._filmDetailsComponent = this._updatedFilmDetailsComponent;
      this._updatedFilmDetailsComponent = null;
    }
    remove(this._commentsComponent);
    this._mode = Mode.DEFAULT;
  }

  _setPopupHandlers() {
    this._filmDetailsComponent.setToWatchlistButtonChangeHandler(() => {
      const updatedMovie = MovieModel.clone(this._movie);
      updatedMovie.isInWatchlist = !updatedMovie.isInWatchlist;
      this._onDataChange(this._movie, updatedMovie);
    });

    this._filmDetailsComponent.setWatchedButtonChangeHandler(() => {
      const updatedMovie = MovieModel.clone(this._movie);
      updatedMovie.isInHistory = !updatedMovie.isInHistory;
      updatedMovie.watchingDate = updatedMovie.watchingDate ? null : new Date();
      this._onDataChange(this._movie, updatedMovie);
    });

    this._filmDetailsComponent.setFavoriteButtonChangeHandler(() => {
      const updatedMovie = MovieModel.clone(this._movie);
      updatedMovie.isFavorite = !updatedMovie.isFavorite;
      this._onDataChange(this._movie, updatedMovie);
    });

    this._filmDetailsComponent.setCloseButtonClickHandler(this._onCloseButtonClick);
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
      this._openPopup();
    });
    this._cardComponent.setToWatchlistButtonClickHandler(() => {
      const updatedMovie = MovieModel.clone(this._movie);
      updatedMovie.isInWatchlist = !updatedMovie.isInWatchlist;
      this._onDataChange(this._movie, updatedMovie);
    });

    this._cardComponent.setWatchedButtonClickHandler(() => {
      const updatedMovie = MovieModel.clone(this._movie);
      updatedMovie.isInHistory = !updatedMovie.isInHistory;
      updatedMovie.watchingDate = updatedMovie.watchingDate ? null : new Date();
      this._onDataChange(this._movie, updatedMovie);
    });

    this._cardComponent.setFavoriteButtonClickHandler(() => {
      const updatedMovie = MovieModel.clone(this._movie);
      updatedMovie.isFavorite = !updatedMovie.isFavorite;
      this._onDataChange(this._movie, updatedMovie);
    });
  }

  _createFilmDetailsComponent() {
    const movie = this._movie;
    const oldFilmDetailsComponent = this._filmDetailsComponent;
    this._updatedFilmDetailsComponent = new FilmDetailsComponent(movie);

    if (!oldFilmDetailsComponent || this._mode === Mode.DEFAULT) {
      this._filmDetailsComponent = this._updatedFilmDetailsComponent;
      this._updatedFilmDetailsComponent = null;
    }
  }

  _createCommentsComponent() {
    const oldCommentsComponent = this._commentsComponent;
    this._commentsComponent = new CommentsComponent(this._movie, this._onCommentsDataChange);

    if (oldCommentsComponent) {
      replace(this._commentsComponent, oldCommentsComponent);
    }
  }

  updateComments(movieId, comments) {
    if (this._movie.id !== movieId) {
      return;
    }
    this._createCommentsComponent();
    this._commentsModel = new CommentsModel();
    this._commentsModel.setComments(comments);
    this._commentsComponent.renderComments(this._commentsModel);
  }

  render(movie) {
    this._movie = movie;
    this._renderCard();
    this._createFilmDetailsComponent();
  }

  rerender(id, newData) {
    if (this._movie.id !== id) {
      return;
    }
    this.render(newData);
    this._resetMovieControls();
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

  _resetMovieControls() {
    switch (this._mode) {
      case Mode.POPUP:
        this._filmDetailsComponent.resetControls();
        break;
      default:
        this._cardComponent.resetControls();
    }
  }

  undoChanges(id) {
    if (this._movie.id !== id) {
      return false;
    }

    switch (this._mode) {
      case Mode.POPUP:
        this._filmDetailsComponent.undoChanges();
        break;
      default:
        this._cardComponent.resetControls();
    }
    return true;
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

  onAddCommentError() {
    if (this._mode !== Mode.POPUP) {
      return false;
    }
    this._commentsComponent.onAddCommentError();
    return true;
  }

  onDeleteCommentError(id) {
    if (this._mode !== Mode.POPUP) {
      return false;
    }
    this._commentsComponent.onDeleteCommentError(id);
    return true;
  }
}
