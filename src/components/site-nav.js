export default class SiteNav {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return (
      `<nav class="main-navigation">
      <div class="main-navigation__items"></div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = this.getTemplate();
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
