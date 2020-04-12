import {getUserProfileTemplate} from "./components/user-profile.js";
import {getMainNavTemplate} from "./components/site-nav.js";
import {getSortingBarTemplate} from "./components/sorting";
import {getCardsListTemplate} from "./components/cards-list.js";
import {getCardTemplate} from "./components/card.js";
import {getShowMoreButtonTemplate} from "./components/show-more.js";
// import {getTopRatedTemplate} from "./components/top-rate.js";
// import {getMostCommentedTemplate} from "./components/most-commented-list.js";
import {getFilmDetailsTemplate} from "./components/film-details.js";
import {generateFilms} from "./mock/film.js";

const SHOWING_CARDS_AMOUNT_ON_START = 5;
const SHOWING_CARDS_AMOUNT_BY_BUTTON = 5;
// const CARDS_AMOUNT_EXTRA = 2;
const FILMS_AMOUNT = 20;
const films = generateFilms(FILMS_AMOUNT);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};


const pageHeaderElement = document.querySelector(`.header`);
const pageMainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);

render(pageHeaderElement, getUserProfileTemplate());
render(pageMainElement, getMainNavTemplate());
render(pageMainElement, getSortingBarTemplate());
render(pageMainElement, getCardsListTemplate());
render(footerElement, getFilmDetailsTemplate(films[0]), `afterend`);

const filmsElement = pageMainElement.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);
const listContainer = filmsListElement.querySelector(`.films-list__container`);
let showingCardsCount = SHOWING_CARDS_AMOUNT_ON_START;
for (let i = 0; i < showingCardsCount; i++) {
  render(listContainer, getCardTemplate(films[i]));
}

render(filmsListElement, getShowMoreButtonTemplate());

const showMoreButtonElement = document.querySelector(`.films-list__show-more`);
showMoreButtonElement.addEventListener(`click`, () => {
  const previousCardsCount = showingCardsCount;
  showingCardsCount += SHOWING_CARDS_AMOUNT_BY_BUTTON;
  films.slice(previousCardsCount, showingCardsCount)
  .forEach((film) => render(listContainer, getCardTemplate(film)));
  if (showingCardsCount >= FILMS_AMOUNT) {
    showMoreButtonElement.remove();
  }
});
// render(filmsElement, getTopRatedTemplate());
// render(filmsElement, getMostCommentedTemplate());

// const renderCardsList = (container, template, amount) => {
//   const extraListContainer = container.querySelector(`.films-list__container`);
//   if (listContainer) {
//     for (let i = 0; i < amount; i++) {
//       render(extraListContainer, template);
//     }
//   }
// };

// const filmListExtraElements = filmsElement.querySelectorAll(`.films-list--extra`);
// filmListExtraElements.forEach((it) => renderCardsList(it, getCardTemplate(), CARDS_AMOUNT_EXTRA));

// Отрисовываю и скрываю попап
const popupElement = document.querySelector(`.film-details`);
popupElement.style.display = `none`;

// Временно вешаю обработчик на первую карточку для открытия попапа
const poster = listContainer.querySelector(`img`);
const onCloseButtonClick = () => {
  popupElement.style.display = `none`;
};
poster.addEventListener(`click`, () => {
  popupElement.style.display = `block`;
  const closeButtonElement = popupElement.querySelector(`.film-details__close-btn`);
  closeButtonElement.addEventListener(`click`, onCloseButtonClick);
});
