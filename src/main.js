import FilterComponent from "./components/filter.js";
import FooterStatComponent from "./components/footer-stat.js";
import PageController from "./controllers/page-controller.js";
import SiteNavComponent from "./components/site-nav.js";
import UserProfileComponent from "./components/user-profile.js";
import {generateFilms} from "./mock/film.js";
import {getUserLevel} from "./utils/components-data.js";
import {render} from "./utils/render.js";

const FILMS_AMOUNT = 20;
const films = generateFilms(FILMS_AMOUNT);
const userLevel = getUserLevel(films);
const bodyElement = document.querySelector(`body`);
const pageHeaderElement = bodyElement.querySelector(`.header`);
const pageMainElement = bodyElement.querySelector(`.main`);

render(pageHeaderElement, new UserProfileComponent(userLevel));

// Отрисовываю навигацию с фильтрами
const siteNavComponent = new SiteNavComponent();
render(pageMainElement, siteNavComponent);
render(siteNavComponent.getElement(), new FilterComponent(films), `afterbegin`);

// Отрисовываю основное содержимое страницы
const pageController = new PageController(pageMainElement, bodyElement);
pageController.render(films);

// Статистика в футере
const footerStatisticsElement = bodyElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FooterStatComponent(films.length), `afterbegin`);
