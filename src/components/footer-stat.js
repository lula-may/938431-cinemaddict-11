import AbstractComponent from "./abstract-component.js";

export default class FooterStat extends AbstractComponent {
  constructor(number) {
    super();
    this._number = number;
  }
  getTemplate() {
    return `<p>${this._number} movies inside</p>`;
  }
}
