import CardsListComponent from "../components/cards-list.js";
import MostCommentedComponent from "../components/most-commented.js";
import NoFilmsComponent from "../components/no-films.js";
import ShowMoreComponent from "../components/show-more.js";
import SortComponent, {SortType} from "../components/sort.js";
import TopRateComponent from "../components/top-rate.js";
import MovieController from "./movie-controller.js";
import MovieModel from "../models/movie.js";
import CommentModel from "../models/comment.js";

import {render, remove} from "../utils/render.js";
import {getMostCommentedFilms, getTopRatedFilms, getSortedFilms} from "../utils/components-data.js";

const SHOWING_CARDS_AMOUNT_ON_START = 5;
const SHOWING_CARDS_AMOUNT_BY_BUTTON = 5;
const CARDS_AMOUNT_EXTRA = 2;

const renderCards = (container, cards, popupContainer, onDataChange, onViewChange, onCommentsDataChange, api) => {
  return cards.map((film) => {
    const movieController = new MovieController(container, popupContainer, onDataChange, onViewChange, onCommentsDataChange, api);
    movieController.render(film);
    return movieController;
  });
};

export default class PageController {
  constructor(container, popupContainer, moviesModel, api) {
    this._moviesModel = moviesModel;
    this._api = api;
    this._showedMovieControllers = [];
    this._showedTopRatedControllers = [];
    this._showedMostCommentedControllers = [];
    this._container = container;
    this._popupContainer = popupContainer;
    this._filmList = null;
    this._filmsListContainer = null;
    this._showingCardsCount = SHOWING_CARDS_AMOUNT_ON_START;
    this._currentFilteredMovies = [];

    this._sortComponent = new SortComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._cardListComponent = new CardsListComponent();
    this._showMoreComponent = new ShowMoreComponent();
    this._topRateComponent = new TopRateComponent();
    this._mostCommentedComponent = new MostCommentedComponent();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onCommentsDataChange = this._onCommentsDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);

    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
  }

  _renderMovies(movies) {
    // создаем контроллеры фильмов и отрисовываем карточки
    // Запоминаем контроллеры
    const newCards = renderCards(this._filmsListContainer, movies.slice(0, this._showingCardsCount),
        this._popupContainer, this._onDataChange, this._onViewChange, this._onCommentsDataChange, this._api);
    this._showedMovieControllers = this._showedMovieControllers.concat(newCards);
    this._showingCardsCount = this._showedMovieControllers.length;
  }

  _removeMovies() {
    this._showedMovieControllers.forEach((controller) => controller.destroy());
    this._showedMovieControllers = [];
    remove(this._showMoreComponent);
  }

  _updateMovies(count) {
    this._removeMovies();
    this._currentFilteredMovies = this._moviesModel.getMovies();
    this._renderMovies(this._currentFilteredMovies.slice(0, count));
    this._renderShowMoreButton();
  }

  _renderShowMoreButton() {
    if (this._showingCardsCount >= this._moviesModel.getMovies().length || !this._showMoreComponent.getElement()) {
      return;
    }
    render(this._filmsList, this._showMoreComponent);
    this._showMoreComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _resetSortType() {
    this._showingCardsCount = SHOWING_CARDS_AMOUNT_ON_START;
    this._sortComponent.setSortType(SortType.DEFAULT);
    this._updateMovies(this._showingCardsCount);
  }

  _createExtraFilms(component, getExtraFilms) {
    const containerElement = component.getElement().querySelector(`.films-list__container`);
    const topMovies = getExtraFilms(this._moviesModel.getAllMovies(), CARDS_AMOUNT_EXTRA);

    const newCards = renderCards(containerElement, topMovies, this._popupContainer,
        this._onDataChange, this._onViewChange, this._onCommentsDataChange, this._api);

    return newCards;
  }

  _renderExtraFilms() {
    const cardsListComponent = this._cardListComponent;

    render(cardsListComponent.getElement(), this._topRateComponent);
    render(cardsListComponent.getElement(), this._mostCommentedComponent);

    // Создаем и запоминаем контроллеры фильмов для дополнительных секций
    this._showedTopRatedControllers = this._createExtraFilms(this._topRateComponent, getTopRatedFilms);
    if (!this._showedTopRatedControllers.length) {
      remove(this._topRateComponent);
    }
    this._showedMostCommentedControllers = this._createExtraFilms(this._mostCommentedComponent, getMostCommentedFilms);
    if (!this._showedMostCommentedControllers.length) {
      remove(this._mostCommentedComponent);
    }
  }

  _updateMostCommentedMovies() {
    this._showedMostCommentedControllers.forEach((controller) => controller.destroy());
    this._showedMostCommentedControllers = this._createExtraFilms(this._mostCommentedComponent, getMostCommentedFilms);
    if (!this._showedMostCommentedControllers.length) {
      remove(this._mostCommentedComponent);
    }
  }

  render() {
    const films = this._moviesModel.getAllMovies();
    this._currentFilteredMovies = films;
    render(this._container, this._sortComponent);

    if (!films.length) {
      render(this._container, this._noFilmsComponent);
      return;
    }
    const cardsListComponent = this._cardListComponent;
    render(this._container, cardsListComponent);

    //  Находим контейнер для карточек фильмов
    this._filmsListContainer = cardsListComponent.getElement().querySelector(`.films-list__container`);
    this._renderMovies(films.slice(0, this._showingCardsCount));

    // Отрисовываем кнопку для открытия следующей порции карточек
    this._filmsList = cardsListComponent.getElement().querySelector(`.films-list`);
    this._renderShowMoreButton();

    // Навешиваем обработчик изменения типа сортировки
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    // Дополнительные секции
    this._renderExtraFilms();
  }

  hide() {
    this._cardListComponent.hide();
    this._sortComponent.hide();
    this._noFilmsComponent.hide();
    this._resetSortType();
  }

  show() {
    this._sortComponent.show();
    this._cardListComponent.show();
    this._noFilmsComponent.show();
  }

  _onShowMoreButtonClick() {
    const previousCardsCount = this._showingCardsCount;
    this._showingCardsCount += SHOWING_CARDS_AMOUNT_BY_BUTTON;
    const nextFilms = this._currentFilteredMovies.slice(previousCardsCount, this._showingCardsCount);
    this._renderMovies(nextFilms);
    if (this._showingCardsCount >= this._currentFilteredMovies.length) {
      remove(this._showMoreComponent);
    }
  }

  _onDataChange(oldData, newData) {
    const allControllers = [...this._showedMovieControllers, ...this._showedTopRatedControllers, ...this._showedMostCommentedControllers];

    this._api.updateMovie(oldData.id, newData)
      .then((updatedData) => {
        const isSuccess = this._moviesModel.updateMovie(oldData.id, updatedData);
        if (isSuccess) {
          allControllers.forEach((controller) => controller.rerender(oldData.id, updatedData));
        }
      })
      .catch(() => {
        for (let controller of allControllers) {
          const isSuccess = controller.undoChanges(oldData.id);
          if (isSuccess) {
            break;
          }
        }
      });
  }

  _onCommentsDataChange(movieId, oldData, newData) {
    const allControllers = [...this._showedMovieControllers, ...this._showedTopRatedControllers, ...this._showedMostCommentedControllers];

    // Добавление нового комментария в модели фильма и комментариев
    if (oldData === null) {
      this._api.addComment(movieId, newData)
      .then((data) => {
        const updatedMovie = MovieModel.parseMovie(data.movie);
        const isSuccess = this._moviesModel.updateMovie(movieId, updatedMovie);
        if (isSuccess) {
          allControllers.forEach((controller) => controller.rerender(movieId, updatedMovie));
        }
        const updatedComments = CommentModel.parseComments(data.comments);
        allControllers.forEach((controller) => controller.updateComments(movieId, updatedComments));
        this._updateMostCommentedMovies();
      })
      .catch(() => {
        for (let controller of allControllers) {
          const isSuccess = controller.onAddCommentError();
          if (isSuccess) {
            break;
          }
        }
      });

    } else if (newData === null) {
      // Удаление комментария из моделей фильма и комментариев
      this._api.deleteComment(oldData.id)
      .then(() => {
        return this._api.getComments(movieId);
      })
      .then((updatedComments) => {
        const movie = this._moviesModel.getMovieById(movieId);
        const updatedMovie = MovieModel.clone(movie);
        updatedMovie.comments = updatedComments;
        const isSuccess = this._moviesModel.updateMovie(movieId, updatedMovie);
        if (isSuccess) {
          allControllers.forEach((controller) => controller.rerender(movieId, updatedMovie));
        }
        allControllers.forEach((controller) => controller.updateComments(movieId, updatedComments));
        this._updateMostCommentedMovies();
      })
      .catch(() => {
        for (let controller of allControllers) {
          const isSuccess = controller.onDeleteCommentError(oldData.id);
          if (isSuccess) {
            break;
          }
        }
      });
    }
  }

  _onViewChange() {
    const allControllers = [...this._showedMovieControllers, ...this._showedTopRatedControllers, ...this._showedMostCommentedControllers];
    allControllers.forEach((controller) => controller.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._removeMovies();
    this._showingCardsCount = SHOWING_CARDS_AMOUNT_ON_START;
    this._currentFilteredMovies = getSortedFilms(this._moviesModel.getMovies(), sortType);
    const sortedFilms = this._currentFilteredMovies.slice(0, this._showingCardsCount);
    this._renderMovies(sortedFilms);
    this._renderShowMoreButton();
  }

  _onFilterChange() {
    this._resetSortType();
  }
}
