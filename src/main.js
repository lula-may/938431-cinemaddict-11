import {getUserProfileTemplate} from "./components/user-profile.js";
import {getMainNavTemplate} from "./components/site-nav.js";
import {getSortingBarTemplate} from "./components/sorting";
import {getCardsListTemplate} from "./components/cards-list.js";
import {getCardTemplate} from "./components/card.js";
import {getShowMoreButtonTemplate} from "./components/show-more.js";
import {getTopRatedTemplate} from "./components/top-rate.js";
import {getMostCommentedTemplate} from "./components/most-commented-list.js";
import {getFilmDetailsTemplate} from "./components/film-details.js";

const CARDS_AMOUNT_MAIN = 5;
const CARDS_AMOUNT_EXTRA = 2;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const renderCardsList = (container, template, amount) => {
  const listContainer = container.querySelector(`.films-list__container`);
  if (listContainer) {
    for (let i = 0; i < amount; i++) {
      render(listContainer, template);
    }
  }
};

const pageHeaderElement = document.querySelector(`.header`);
const pageMainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);

render(pageHeaderElement, getUserProfileTemplate());
render(pageMainElement, getMainNavTemplate());
render(pageMainElement, getSortingBarTemplate());
render(pageMainElement, getCardsListTemplate());

const filmsElement = pageMainElement.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);
renderCardsList(filmsElement, getCardTemplate(), CARDS_AMOUNT_MAIN);
render(filmsListElement, getShowMoreButtonTemplate());

render(filmsElement, getTopRatedTemplate());
render(filmsElement, getMostCommentedTemplate());

const filmListExtraElements = filmsElement.querySelectorAll(`.films-list--extra`);
filmListExtraElements.forEach((it) => renderCardsList(it, getCardTemplate(), CARDS_AMOUNT_EXTRA));

// Отрисовываю попап, чтобы не ругался eslint на неиспользуемый код
render(footerElement, getFilmDetailsTemplate(), `afterend`);
// Скрываю попап
document.querySelector(`.film-details`).style.display = `none`;
