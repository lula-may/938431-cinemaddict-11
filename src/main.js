import CardComponent from "./components/card.js";
import CardsListComponent from "./components/cards-list.js";
import FilmDetailsComponent from "./components/film-details.js";
import FilterComponent from "./components/filter.js";
import FooterStatComponent from "./components/footer-stat.js";
import MostCommentedComponent from "./components/most-commented.js";
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
const FILMS_AMOUNT = 40;
const films = generateFilms(FILMS_AMOUNT);
const userLevel = getUserLevel(films);

// const render = (container, template, place = `beforeend`) => {
//   container.insertAdjacentHTML(place, template);
// };

const pageHeaderElement = document.querySelector(`.header`);
const pageMainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);
debugger;
render(pageHeaderElement, new UserProfileComponent(getUserLevel(films)).getElement(), RenderPosition.BEFOREEND);
// render(pageMainElement, getMainNavTemplate(filters));
// render(pageMainElement, getSortingBarTemplate());
// render(pageMainElement, getCardsListTemplate());
// render(footerElement, getFooterStatisticTemplate(films.length));
// render(footerElement, getFilmDetailsTemplate(films[0]), `afterend`);

// const filmsElement = pageMainElement.querySelector(`.films`);
// const filmsListElement = filmsElement.querySelector(`.films-list`);
// const listContainer = filmsListElement.querySelector(`.films-list__container`);
// let showingCardsCount = SHOWING_CARDS_AMOUNT_ON_START;
// for (let i = 0; i < showingCardsCount; i++) {
//   render(listContainer, getCardTemplate(films[i]));
// }
// Отрисовываю и скрываю попап
// const popupElement = document.querySelector(`.film-details`);
// popupElement.style.display = `none`;

// Временно вешаю обработчик на первую карточку для открытия попапа
// const poster = listContainer.querySelector(`img`);
// const onCloseButtonClick = () => {
//   popupElement.style.display = `none`;
// };
// poster.addEventListener(`click`, () => {
//   popupElement.style.display = `block`;
//   const closeButtonElement = popupElement.querySelector(`.film-details__close-btn`);
//   closeButtonElement.addEventListener(`click`, onCloseButtonClick);
// });

// Кнопка для открытия следующей порции карточек
// render(filmsListElement, getShowMoreButtonTemplate());

// const showMoreButtonElement = document.querySelector(`.films-list__show-more`);
// showMoreButtonElement.addEventListener(`click`, () => {
//   const previousCardsCount = showingCardsCount;
//   showingCardsCount += SHOWING_CARDS_AMOUNT_BY_BUTTON;
//   films.slice(previousCardsCount, showingCardsCount)
//   .forEach((film) => render(listContainer, getCardTemplate(film)));
//   if (showingCardsCount >= FILMS_AMOUNT) {
//     showMoreButtonElement.remove();
//   }
// });

// Дополнительные секции
// render(filmsElement, getTopRatedTemplate());
// render(filmsElement, getMostCommentedTemplate());

// const filmListExtraElements = filmsElement.querySelectorAll(`.films-list--extra`);
// const extraFilms = getExtraFilms(films, CARDS_AMOUNT_EXTRA);
// let count = 0;
// filmListExtraElements.forEach((listElement) => {
//   const container = listElement.querySelector(`.films-list__container`);
//   extraFilms[count].forEach((film) => render(container, getCardTemplate(film)));
//   count++;
// });

