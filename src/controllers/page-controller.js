import CardComponent from "../components/card.js";
import CardsListComponent from "../components/cards-list.js";
import FilmDetailsComponent from "../components/film-details.js";
import MostCommentedComponent from "../components/most-commented.js";
import NoFilmsComponent from "../components/no-films.js";
import ShowMoreComponent from "../components/show-more.js";
import SortComponent from "../components/sort.js";
import TopRateComponent from "../components/top-rate.js";

import {render, remove} from "../utils/render.js";
import {getExtraFilms, getSortedFilms} from "../utils/components-data.js";

const SHOWING_CARDS_AMOUNT_ON_START = 5;
const SHOWING_CARDS_AMOUNT_BY_BUTTON = 5;
const CARDS_AMOUNT_EXTRA = 2;

const renderCard = (cardsListContainer, film, popupContainer) => {
  const cardComponent = new CardComponent(film);
  const filmDetailsComponent = new FilmDetailsComponent(film);

  const openPopup = () => {
    render(popupContainer, filmDetailsComponent);
    filmDetailsComponent.setCloseButtonClickHandler(onCloseButtonClick);
    document.addEventListener(`keydown`, onEscPress);
  };

  const closePopup = () => {
    remove(filmDetailsComponent);
  };

  const onCloseButtonClick = () => {
    closePopup();
    document.removeEventListener(`keydown`, onEscPress);
  };

  const onEscPress = (evt) => {
    evt.preventDefault();
    if (evt.key === `Escape`) {
      closePopup();
      document.removeEventListener(`keydown`, onEscPress);
    }
  };

  render(cardsListContainer, cardComponent);
  cardComponent.setClickHandlers(() => openPopup());
};

const renderCards = (container, cards, popupContainer) => {
  cards.forEach((film) => renderCard(container, film, popupContainer));
};


export default class PageController {
  constructor(container, popupContainer) {
    this._container = container;
    this._popupContainer = popupContainer;

    this._sortComponent = new SortComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._cardListComponent = new CardsListComponent();
    this._showMoreComponent = new ShowMoreComponent();
    this._topRateComponent = new TopRateComponent();
    this._mostCommentedComponent = new MostCommentedComponent();
  }

  render(films) {
    let showingFilms = films.slice();

    const renderShowMore = () => {
      render(filmsListElement, this._showMoreComponent);

      const onShowMoreButtonClick = () => {
        const previousCardsCount = showingCardsCount;
        showingCardsCount += SHOWING_CARDS_AMOUNT_BY_BUTTON;
        renderCards(listContainer, showingFilms.slice(previousCardsCount, showingCardsCount), this._popupContainer);
        if (showingCardsCount >= showingFilms.length) {
          remove(this._showMoreComponent);
        }
      };

      this._showMoreComponent.setClickHandler(onShowMoreButtonClick);
    };

    // Отрисовываю сортировку
    render(this._container, this._sortComponent);

    // Сообщение об отсутствии фильмов в системе, если их нет
    if (!films.length) {
      render(this._container, this._noFilmsComponent);
      return;
    }
    //  Контейнер для карточек фильмов
    const cardsListComponent = this._cardListComponent;
    render(this._container, cardsListComponent);
    const listContainer = cardsListComponent.getElement().querySelector(`.films-list__container`);
    let showingCardsCount = SHOWING_CARDS_AMOUNT_ON_START;
    renderCards(listContainer, showingFilms.slice(0, showingCardsCount));

    // Кнопка для открытия следующей порции карточек
    const filmsListElement = cardsListComponent.getElement().querySelector(`.films-list`);
    renderShowMore();

    // Навешиваю обработчик изменения типа сортировки
    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      listContainer.innerHTML = ``;
      showingFilms = getSortedFilms(films, sortType);
      showingCardsCount = SHOWING_CARDS_AMOUNT_ON_START;
      renderCards(listContainer, showingFilms.slice(0, showingCardsCount));
      renderShowMore();
    });

    // Дополнительные секции
    render(cardsListComponent.getElement(), this._topRateComponent);
    render(cardsListComponent.getElement(), this._mostCommentedComponent);

    const filmListExtraElements = cardsListComponent.getElement().querySelectorAll(`.films-list--extra`);
    const extraFilms = getExtraFilms(films, CARDS_AMOUNT_EXTRA);
    let count = 0;
    filmListExtraElements.forEach((listElement) => {
      const extraFilmsContainer = listElement.querySelector(`.films-list__container`);
      renderCards(extraFilmsContainer, extraFilms[count], this._popupContainer);
      count++;
    });
  }
}
