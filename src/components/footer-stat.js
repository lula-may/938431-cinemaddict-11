import {createElement} from "../utils.js";

export default class FooterStat {
  constructor(number) {
    this._number = number;
    this._element = null;
  }
  getTemplate() {
    return `<p>${this._number} movies inside</p>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
