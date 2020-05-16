import API from "./api.js";
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

// const FILMS_AMOUNT = 20;
const AUTHORIZATION = `Basic f8Lid33jXHpo4/?`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;

// const films = generateFilms(FILMS_AMOUNT);
const comments = getComments();

const bodyElement = document.querySelector(`body`);
const pageHeaderElement = bodyElement.querySelector(`.header`);
const pageMainElement = bodyElement.querySelector(`.main`);
const footerStatisticsElement = bodyElement.querySelector(`.footer__statistics`);

const api = new API(AUTHORIZATION, END_POINT);

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();

const siteNavComponent = new SiteNavComponent();
const statisticsComponent = new StatisticsComponent(moviesModel);
const filterController = new FilterController(siteNavComponent.getElement(), moviesModel);
const pageController = new PageController(pageMainElement, bodyElement, moviesModel, commentsModel);

siteNavComponent.setOnChangeHandler((navItem) => {
  if (navItem === NavType.STATS) {
    pageController.hide();
    statisticsComponent.update();
    statisticsComponent.show();
  } else {
    statisticsComponent.hide();
    pageController.show();
  }
});

render(pageMainElement, siteNavComponent);
// Экран со статистикой
render(pageMainElement, statisticsComponent);
statisticsComponent.hide();

api.getMovies()
.then((movies) => {
  moviesModel.setMovies(movies);
  const userLevel = getFilmsByFilter(FilterType.HISTORY, movies).length;
  render(pageHeaderElement, new UserProfileComponent(userLevel));
  filterController.render();
  debugger;
  pageController.render();
  render(footerStatisticsElement, new FooterStatComponent(movies.length), RenderPosition.AFTERBEGIN);
});
// Навигация с фильтрами
// commentsModel.setComments(comments);

// Основное содержимое страницы


// Статистика в футере
