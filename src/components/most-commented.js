import {createElement} from "../utils.js";

export default class MostCommented {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return (
      `<section class="films-list--extra">
        <h2 class="films-list__title">Most commented</h2>
        <div class="films-list__container"></div>
      </section>`
    );
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
