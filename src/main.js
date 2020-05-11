import CommentsModel from "./models/comments.js";
import FilterController, {getFilmsByFilter} from "./controllers/filter.js";
import FooterStatComponent from "./components/footer-stat.js";
import MoviesModel from "./models/movies.js";
import PageController from "./controllers/page-controller.js";
import SiteNavComponent from "./components/site-nav.js";
import StatisticsComponent from "./components/statistics.js";
import UserProfileComponent from "./components/user-profile.js";
import {generateFilms} from "./mock/film.js";
import {getComments} from "./mock/comments.js";
import {RenderPosition, render} from "./utils/render.js";
import {NavType, FilterType} from "./const.js";

const FILMS_AMOUNT = 40;

const films = generateFilms(FILMS_AMOUNT);
const comments = getComments();
const userLevel = getFilmsByFilter(FilterType.HISTORY, films).length;
const bodyElement = document.querySelector(`body`);
const pageHeaderElement = bodyElement.querySelector(`.header`);
const pageMainElement = bodyElement.querySelector(`.main`);

const moviesModel = new MoviesModel();
moviesModel.setMovies(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

render(pageHeaderElement, new UserProfileComponent(userLevel));

// Отрисовываю навигацию с фильтрами
const siteNavComponent = new SiteNavComponent();
siteNavComponent.setOnChangeHandler((navItem) => {
  if (navItem === NavType.STATS) {
    pageController.hide();
    statisticsComponent.show();
  } else {
    statisticsComponent.hide();
    pageController.show();
  }
});
render(pageMainElement, siteNavComponent);

const filterController = new FilterController(siteNavComponent.getElement(), moviesModel);
filterController.render();

// Отрисовываю основное содержимое страницы
const pageController = new PageController(pageMainElement, bodyElement, moviesModel, commentsModel);
pageController.render();

// Отрисовываю блок со статистикой
const statisticsComponent = new StatisticsComponent(moviesModel);
render(pageMainElement, statisticsComponent);
statisticsComponent.hide();

// Статистика в футере
const footerStatisticsElement = bodyElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FooterStatComponent(films.length), RenderPosition.AFTERBEGIN);
