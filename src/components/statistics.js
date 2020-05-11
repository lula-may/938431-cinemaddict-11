import AbstractSmartComponent from "./abstract-smart-component.js";
import {capitalizeFirstLetter, resetTime} from "../utils/common.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {getFilmsByFilter} from "../controllers/filter.js";
import {FilterType} from "../const.js";
import {getUserTitle} from "./user-profile.js";
import moment from "moment";

const FILTERS = [`all-time`, `today`, `week`, `month`, `year`];

const StatisticsFilterType = {
  ALL: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const isUniqItem = (item, index, items) => {
  return items.indexOf(item) === index;
};

const getSameItemsAmount = (it, items) => {
  return items.filter((item) => item === it).length;
};

const getAllMoviesGenres = (movies) => movies.reduce((acc, movie) => {
  acc = acc.concat(movie.genres);
  return acc;
}, []);

const getSortedGenres = (allGenres) => allGenres.filter(isUniqItem)
  .sort((left, right) => {
    return getSameItemsAmount(right, allGenres) - getSameItemsAmount(left, allGenres);
  });

const getDateFromByFilter = (filter) => {
  if (filter === StatisticsFilterType.ALL) {
    return null;
  }
  let dateFrom = moment();
  switch (filter) {
    case StatisticsFilterType.TODAY:
      break;
    case StatisticsFilterType.WEEK:
      dateFrom.subtract(7, `days`);
      break;
    case StatisticsFilterType.MONTH:
      dateFrom.subtract(1, `months`);
      resetTime(dateFrom);
      break;
    case StatisticsFilterType.YEAR:
      dateFrom.subtract(1, `years`);
      resetTime(dateFrom);
      break;
  }
  return resetTime(dateFrom);
};

const getMoviesByStatisticsFilter = (filter, movies) => {
  const dateFrom = getDateFromByFilter(filter);
  if (!dateFrom) {
    return movies;
  }
  const dateTo = moment();
  return movies.filter((movie) => {
    const watchingDate = moment(movie.watchingDate);
    return watchingDate <= dateTo && watchingDate >= dateFrom;
  });
};

const getTotalDuration = (movies) => {
  return movies.reduce((acc, movie) => {
    acc += movie.duration;
    return acc;
  }, 0);
};

const getFiltersMarkup = (activeFilter) => {
  return FILTERS
  .map((filter) => {
    const filterLabel = capitalizeFirstLetter(filter.split(`-`).join(` `));
    const isChecked = activeFilter === filter;
    return (
      `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
        id="statistic-${filter}" value="${filter}" ${isChecked ? `checked` : ``}>
        <label for="statistic-${filter}" class="statistic__filters-label">${filterLabel}</label>`
    );
  })
  .join(`\n`);
};

const getStatisticsTemplate = ({userRank, movies, activeFilter}) => {
  const filtersMarkup = getFiltersMarkup(activeFilter);
  const amount = movies.length;
  const totalDuration = moment.duration(getTotalDuration(movies), `minutes`);
  const hours = Math.floor(totalDuration.asHours());
  const minutes = totalDuration.minutes();
  const topGenre = getSortedGenres(getAllMoviesGenres(movies))[0] || ``;

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${userRank}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${filtersMarkup}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${amount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );

};

const renderGenresChart = (statisticCtx, movies) => {
  const BAR_HEIGHT = 50;
  const allMoviesGenres = getAllMoviesGenres(movies);
  const genres = getSortedGenres(allMoviesGenres);
  const values = genres.map((genre) => {
    return allMoviesGenres.filter((it) => it === genre).length;
  });

  // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
  statisticCtx.height = BAR_HEIGHT * genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: values,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`,
        barThickness: 24
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

export default class Statistics extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;
    this._watchedMovies = [];
    this._moviesForPeriod = [];
    this._activeFilter = StatisticsFilterType.ALL;

    this._chart = null;
    this._renderChart();
    this._setFilterChangeHandler();
  }

  getTemplate() {
    const userRank = getUserTitle(this._watchedMovies.length);
    const movies = this._moviesForPeriod;
    return getStatisticsTemplate({userRank, movies, activeFilter: this._activeFilter});
  }

  recoveryListeners() {
    this._setFilterChangeHandler();
  }

  rerender() {
    super.rerender();
    this._resetChart();
    this._renderChart();
  }

  update() {
    this._watchedMovies = getFilmsByFilter(FilterType.HISTORY, this._moviesModel.getAllMovies());
    this._moviesForPeriod = [].concat(this._watchedMovies);
    this._activeFilter = StatisticsFilterType.ALL;
    this.rerender();
  }

  _renderChart() {
    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);
    this._chart = renderGenresChart(statisticCtx, this._moviesForPeriod);
  }

  _resetChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  _setFilterChangeHandler() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._activeFilter = evt.target.value;
      this._moviesForPeriod = getMoviesByStatisticsFilter(this._activeFilter, this._watchedMovies);
      this.rerender();
    });
  }
}
