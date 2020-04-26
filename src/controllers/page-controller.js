import CardsListComponent from "../components/cards-list.js";
import MostCommentedComponent from "../components/most-commented.js";
import NoFilmsComponent from "../components/no-films.js";
import ShowMoreComponent from "../components/show-more.js";
import SortComponent from "../components/sort.js";
import TopRateComponent from "../components/top-rate.js";
import MovieController from "./movie-controller.js";

import {render, remove} from "../utils/render.js";
import {getExtraFilms, getSortedFilms} from "../utils/components-data.js";

const SHOWING_CARDS_AMOUNT_ON_START = 5;
const SHOWING_CARDS_AMOUNT_BY_BUTTON = 5;
const CARDS_AMOUNT_EXTRA = 2;


const renderCards = (container, cards, popupContainer, onDataChange, onViewChange) => {
  return cards.map((film) => {
    const movieController = new MovieController(container, popupContainer, onDataChange, onViewChange);
    movieController.render(film);
    return movieController;
  });
};

export default class PageController {
  constructor(container, popupContainer) {
    this._films = [];
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
    this._onViewChange = this._onViewChange.bind(this);
  }

  _renderShowMoreButton() {
    if (this._showingCardsCount >= this._films.length) {
      return;
    }
    render(this._filmsList, this._showMoreComponent);

    const onShowMoreButtonClick = () => {
      const previousCardsCount = this._showingCardsCount;
      this._showingCardsCount += SHOWING_CARDS_AMOUNT_BY_BUTTON;
      const sortedFilms = getSortedFilms(this._films, this._sortComponent.getSortType());
      const newCards = renderCards(this._filmsListContainer, sortedFilms.slice(previousCardsCount, this._showingCardsCount),
          this._popupContainer, this._onDataChange, this._onViewChange);
      this._showedMovieControllers = this._showedMovieControllers.concat(newCards);
      if (this._showingCardsCount >= sortedFilms.length) {
        remove(this._showMoreComponent);
      }
    };

    this._showMoreComponent.setClickHandler(onShowMoreButtonClick);
  }

  _onDataChange(oldData, newData) {
    const index = this._films.indexOf(oldData);
    if (index !== -1) {
      this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));
      this._showedMovieControllers.concat(this._showedExtraMovieControllers).forEach((controller) => controller.rerender(oldData, newData));
    }
  }

  _onViewChange() {
    this._showedMovieControllers.concat(this._showedExtraMovieControllers).forEach((controller) => controller.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._filmsListContainer.innerHTML = ``;
    const sortedFilms = getSortedFilms(this._films, sortType);
    this._showingCardsCount = SHOWING_CARDS_AMOUNT_ON_START;
    const newCards = renderCards(this._filmsListContainer, sortedFilms.slice(0, this._showingCardsCount),
        this._popupContainer, this._onDataChange, this._onViewChange);
    this._showedMovieControllers = newCards;
    this._renderShowMoreButton();
  }

  _renderExtraFilms() {
    const cardsListComponent = this._cardListComponent;

    render(cardsListComponent.getElement(), this._topRateComponent);
    render(cardsListComponent.getElement(), this._mostCommentedComponent);

    const filmListExtraElements = cardsListComponent.getElement().querySelectorAll(`.films-list--extra`);
    const extraFilms = getExtraFilms(this._films, CARDS_AMOUNT_EXTRA);
    let count = 0;
    filmListExtraElements.forEach((listElement) => {
      const extraFilmsContainer = listElement.querySelector(`.films-list__container`);
      const newCards = renderCards(extraFilmsContainer, extraFilms[count], this._popupContainer, this._onDataChange, this._onViewChange);
      this._showedExtraMovieControllers = this._showedExtraMovieControllers.concat(newCards);
      count++;
    });
  }

  render(films) {
    this._films = films;
    render(this._container, this._sortComponent);

    if (!films.length) {
      render(this._container, this._noFilmsComponent);
      return;
    }
    const cardsListComponent = this._cardListComponent;
    render(this._container, cardsListComponent);

    //  Находим контейнер для карточек фильмов
    // создаем контроллеры фильмов и отрисовываем карточки
    // Запоминаем контроллеры
    this._filmsListContainer = cardsListComponent.getElement().querySelector(`.films-list__container`);
    const newCards = renderCards(this._filmsListContainer, films.slice(0, this._showingCardsCount), this._popupContainer,
        this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newCards);

    // Отрисовываем кнопку для открытия следующей порции карточек
    this._filmsList = cardsListComponent.getElement().querySelector(`.films-list`);
    this._renderShowMoreButton();

    // Навешиваем обработчик изменения типа сортировки
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    // Дополнительные секции
    this._renderExtraFilms();
  }
}
