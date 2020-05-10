import AbstractComponent from "./abstract-component.js";
import {NavType} from "../const.js";

export default class SiteNav extends AbstractComponent {
  constructor() {
    super();
    this._currentItem = NavType.FILMS;
  }
  getTemplate() {
    return (
      `<nav class="main-navigation">
      <a href="#stats" class="main-navigation__additional" id="stats">Stats</a>
    </nav>`
    );
  }
  setOnChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      switch (evt.target.id) {
        // Нажатие на кнопку Stats
        case NavType.STATS:
          if (this._currentItem === NavType.STATS) {
            return;
          }
          this._currentItem = NavType.STATS;
          handler(this._currentItem);
          break;
        default:
          if (this._currentItem === NavType.FILMS) {
            return;
          }
          this._currentItem = NavType.FILMS;
          handler(this._currentItem);
      }
    });
  }
}
