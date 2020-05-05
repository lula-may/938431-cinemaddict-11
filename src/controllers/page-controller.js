import CardsListComponent from "../components/cards-list.js";
import MostCommentedComponent from "../components/most-commented.js";
import NoFilmsComponent from "../components/no-films.js";
import ShowMoreComponent from "../components/show-more.js";
import SortComponent, {SortType} from "../components/sort.js";
import TopRateComponent from "../components/top-rate.js";
import MovieController from "./movie-controller.js";

import {render, remove} from "../utils/render.js";
import {getExtraFilms, getSortedFilms} from "../utils/components-data.js";

const SHOWING_CARDS_AMOUNT_ON_START = 5;
const SHOWING_CARDS_AMOUNT_BY_BUTTON = 5;
const CARDS_AMOUNT_EXTRA = 2;


const renderCards = (container, cards, commentsModel, popupContainer, onDataChange, onViewChange, onCommentsDataChange) => {
  return cards.map((film) => {
    const movieController = new MovieController(container, popupContainer, commentsModel, onDataChange, onViewChange, onCommentsDataChange);
    movieController.render(film);
    return movieController;
  });
};

export default class PageController {
  constructor(container, popupContainer, moviesModel, commentsModel) {
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._showedMovieControllers = [];
    this._showedExtraMovieControllers = [];
    this._container = container;
    this._popupContainer = popupContainer;
    this._filmList = null;
    this._filmsListContainer = null;
    this._showingCardsCount = SHOWING_CARDS_AMOUNT_ON_START;

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

  _onShowMoreButtonClick() {
    const previousCardsCount = this._showingCardsCount;
    this._showingCardsCount += SHOWING_CARDS_AMOUNT_BY_BUTTON;
    const movies = this._moviesModel.getMovies();
    const sortedFilms = getSortedFilms(movies, this._sortComponent.getSortType())
        .slice(previousCardsCount, this._showingCardsCount);
    this._renderMovies(sortedFilms);
    if (this._showingCardsCount >= movies.length) {
      remove(this._showMoreComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showingCardsCount >= this._moviesModel.getAllMovies().length) {
      return;
    }
    render(this._filmsList, this._showMoreComponent);
    this._showMoreComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _onDataChange(oldData, newData) {
    const isSuccess = this._moviesModel.updateMovie(oldData.id, newData);
    if (isSuccess) {
      this._showedMovieControllers.concat(this._showedExtraMovieControllers).forEach((controller) => controller.rerender(oldData.id, newData));
    }
  }

  _onCommentsDataChange(movie, oldData, newData) {
    // Добавление нового комментария
    if (oldData === null) {
      this._commentsModel.addComment(newData);
    } else if (newData === null) {
      // Удаление комментария из моделей комментариев и фильмов
      this._commentsModel.removeComment(oldData.id);
      const index = movie.comments.findIndex((id) => id === oldData.id);
      const newComments = [].concat(movie.comments.slice(0, index), movie.comments.slice(index + 1));
      const newMovie = Object.assign({}, movie, {comments: newComments});
      const isSuccess = this._moviesModel.updateMovie(movie.id, newMovie);

      if (isSuccess) {
        this._showedMovieControllers.concat(this._showedExtraMovieControllers).forEach((controller) => controller.rerender(movie.id, newMovie));
      }
    }
  }


  _onViewChange() {
    this._showedMovieControllers.concat(this._showedExtraMovieControllers).forEach((controller) => controller.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._removeMovies();
    this._showingCardsCount = SHOWING_CARDS_AMOUNT_ON_START;
    const sortedFilms = getSortedFilms(this._moviesModel.getMovies(), sortType).slice(0, this._showingCardsCount);
    this._renderMovies(sortedFilms);
    this._renderShowMoreButton();
  }

  _onFilterChange() {
    this._showingCardsCount = SHOWING_CARDS_AMOUNT_ON_START;
    this._sortComponent.setSortType(SortType.DEFAULT);
    this._updateMovies(this._showingCardsCount);
  }

  _renderExtraFilms() {
    const cardsListComponent = this._cardListComponent;

    render(cardsListComponent.getElement(), this._topRateComponent);
    render(cardsListComponent.getElement(), this._mostCommentedComponent);

    const filmListExtraElements = cardsListComponent.getElement().querySelectorAll(`.films-list--extra`);
    const extraFilms = getExtraFilms(this._moviesModel.getAllMovies(), CARDS_AMOUNT_EXTRA);
    let count = 0;
    filmListExtraElements.forEach((listElement) => {
      const extraFilmsContainer = listElement.querySelector(`.films-list__container`);
      const newCards = renderCards(extraFilmsContainer, extraFilms[count], this._commentsModel,
          this._popupContainer, this._onDataChange, this._onViewChange, this._onCommentsDataChange);
      this._showedExtraMovieControllers = this._showedExtraMovieControllers.concat(newCards);
      count++;
    });
  }

  _removeMovies() {
    this._showedMovieControllers.forEach((controller) => controller.destroy());
    this._showedMovieControllers = [];
  }

  _renderMovies(movies) {
    // создаем контроллеры фильмов и отрисовываем карточки
    // Запоминаем контроллеры
    const newCards = renderCards(this._filmsListContainer, movies.slice(0, this._showingCardsCount), this._commentsModel,
        this._popupContainer, this._onDataChange, this._onViewChange, this._onCommentsDataChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newCards);
    this._showingCardsCount = this._showedMovieControllers.length;
  }

  _updateMovies(count) {
    this._removeMovies();
    this._renderMovies(this._moviesModel.getMovies().slice(0, count));
    this._renderShowMoreButton();
  }

  render() {
    const films = this._moviesModel.getAllMovies();
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
}
