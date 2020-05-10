import AbstractSmartComponent from "./abstract-smart-component.js";
import {capitalizeFirstLetter} from "../utils/common.js";

const FILTERS = [`all-time`, `today`, `week`, `month`, `year`];

const FilterType = {
  ALL: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const getFiltersMarkup = (activeFilter) => {
  return FILTERS
  .map((filter) => {
    const filterLabel = capitalizeFirstLetter(filter.split(`-`).join(` `));
    const isChecked = activeFilter === filter;
    return (
      `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
        id="statistic-${filter}" value="${filter}" ${isChecked ? `checked` : ``}>
        <label for="statistic-all-time" class="statistic__filters-label">${filterLabel}</label>`
    );
  })
  .join(`\n`);
};
const getStatisticsTemplate = (activeFilter) => {
  const filtersMarkup = getFiltersMarkup(activeFilter);
  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">Sci-Fighter</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${filtersMarkup}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">22 <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">130 <span class="statistic__item-description">h</span> 22 <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">Sci-Fi</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );

};
export default class Statistics extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;
    this._activeFilter = FilterType.ALL;
  }
  getTemplate() {
    return getStatisticsTemplate(this._activeFilter);
  }

}
