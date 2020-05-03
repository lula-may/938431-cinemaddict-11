import CommentsModel from "./models/comments.js";
import FilterComponent from "./components/filter.js";
import FooterStatComponent from "./components/footer-stat.js";
import MoviesModel from "./models/movies.js";
import PageController from "./controllers/page-controller.js";
import SiteNavComponent from "./components/site-nav.js";
import UserProfileComponent from "./components/user-profile.js";
import {generateFilms} from "./mock/film.js";
import {getComments} from "./mock/comments.js";
import {getUserLevel} from "./utils/components-data.js";
import {RenderPosition, render} from "./utils/render.js";

const FILMS_AMOUNT = 20;
const films = generateFilms(FILMS_AMOUNT);
const comments = getComments();
const userLevel = getUserLevel(films);
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
render(pageMainElement, siteNavComponent);
render(siteNavComponent.getElement(), new FilterComponent(films), RenderPosition.AFTERBEGIN);

// Отрисовываю основное содержимое страницы
const pageController = new PageController(pageMainElement, bodyElement, moviesModel, commentsModel);
pageController.render();

// Статистика в футере
const footerStatisticsElement = bodyElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FooterStatComponent(films.length), RenderPosition.AFTERBEGIN);
