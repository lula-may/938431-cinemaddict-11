import CardComponent from "./components/card.js";
import CardsListComponent from "./components/cards-list.js";
import FilmDetailsComponent from "./components/film-details.js";
import FilterComponent from "./components/filter.js";
import FooterStatComponent from "./components/footer-stat.js";
import MostCommentedComponent from "./components/most-commented.js";
import NoFilmsComponent from "./components/no-films.js";
import ShowMoreComponent from "./components/show-more.js";
import SiteNavComponent from "./components/site-nav.js";
import SortComponent from "./components/sort.js";
import TopRateComponent from "./components/top-rate.js";
import UserProfileComponent from "./components/user-profile.js";
import {generateFilms} from "./mock/film.js";
import {getUserLevel, getExtraFilms} from "./components/utils.js";
import {render, RenderPosition} from "./utils.js";

const SHOWING_CARDS_AMOUNT_ON_START = 5;
const SHOWING_CARDS_AMOUNT_BY_BUTTON = 5;
const CARDS_AMOUNT_EXTRA = 2;
const FILMS_AMOUNT = 0;
const films = generateFilms(FILMS_AMOUNT);
const userLevel = getUserLevel(films);
const bodyElement = document.querySelector(`body`);
const pageHeaderElement = bodyElement.querySelector(`.header`);
const pageMainElement = bodyElement.querySelector(`.main`);

const renderCard = (cardsListContainer, film) => {
  const cardComponent = new CardComponent(film);
  const filmDetailsComponent = new FilmDetailsComponent(film);

  const openPopup = () => {
    bodyElement.appendChild(filmDetailsComponent.getElement());
    const closeButtonElement = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);
    closeButtonElement.addEventListener(`click`, onCloseButtonClick);
    document.addEventListener(`keydown`, onEscPress);
  };

  const removePopup = () => {
    bodyElement.removeChild(filmDetailsComponent.getElement());
    filmDetailsComponent.removeElement();
  };

  const onCloseButtonClick = () => {
    removePopup();
    document.removeEventListener(`keydown`, onEscPress);
  };

  const onEscPress = (evt) => {
    evt.preventDefault();
    if (evt.key === `Escape`) {
      removePopup();
      document.removeEventListener(`keydown`, onEscPress);
    }
  };

  const poster = cardComponent.getElement().querySelector(`.film-card__poster`);
  const title = cardComponent.getElement().querySelector(`.film-card__title`);
  const comment = cardComponent.getElement().querySelector(`.film-card__comments`);

  poster.addEventListener(`click`, () => openPopup());
  title.addEventListener(`click`, () => openPopup());
  comment.addEventListener(`click`, () => openPopup());
  render(cardsListContainer, cardComponent.getElement());
};

const renderMainBoard = () => {
  // Отрисовываю навигацию с фильтрами
  const siteNavComponent = new SiteNavComponent();
  render(pageMainElement, siteNavComponent.getElement());
  render(siteNavComponent.getElement(), new FilterComponent(films).getElement(), RenderPosition.AFTERBEGIN);

  // Отрисовываю сортировку
  render(pageMainElement, new SortComponent().getElement());

  // Сообщение об отсутствии фильмов в системе, если их нет
  if (!films.length) {
    render(pageMainElement, new NoFilmsComponent().getElement());
    return;
  }
  //  Контейнер для карточек фильмов
  const cardsListComponent = new CardsListComponent();
  render(pageMainElement, cardsListComponent.getElement());
  const listContainer = cardsListComponent.getElement().querySelector(`.films-list__container`);
  let showingCardsCount = SHOWING_CARDS_AMOUNT_ON_START;
  for (let i = 0; i < showingCardsCount; i++) {
    renderCard(listContainer, films[i]);
  }

  // Кнопка для открытия следующей порции карточек
  const filmsListElement = cardsListComponent.getElement().querySelector(`.films-list`);
  const showMoreComponent = new ShowMoreComponent();
  render(filmsListElement, showMoreComponent.getElement());

  showMoreComponent.getElement().addEventListener(`click`, () => {
    const previousCardsCount = showingCardsCount;
    showingCardsCount += SHOWING_CARDS_AMOUNT_BY_BUTTON;
    films.slice(previousCardsCount, showingCardsCount)
    .forEach((film) => renderCard(listContainer, film));
    if (showingCardsCount >= FILMS_AMOUNT) {
      showMoreComponent.getElement().remove();
      showMoreComponent.removeElement();
    }
  });

  // Дополнительные секции
  render(cardsListComponent.getElement(), new TopRateComponent().getElement());
  render(cardsListComponent.getElement(), new MostCommentedComponent().getElement());

  const filmListExtraElements = cardsListComponent.getElement().querySelectorAll(`.films-list--extra`);
  const extraFilms = getExtraFilms(films, CARDS_AMOUNT_EXTRA);
  let count = 0;
  filmListExtraElements.forEach((listElement) => {
    const container = listElement.querySelector(`.films-list__container`);
    extraFilms[count].forEach((film) => renderCard(container, film));
    count++;
  });

};

render(pageHeaderElement, new UserProfileComponent(userLevel).getElement());

renderMainBoard();

// Статистика в футере
const footerStatisticsElement = bodyElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FooterStatComponent(films.length).getElement(), RenderPosition.AFTERBEGIN);

