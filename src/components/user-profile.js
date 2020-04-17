import {createElement} from "../utils.js";
const NOVICE = 10;
const FAN = 20;

const getUserTitle = (number) => {
  if (number > FAN) {
    return `Movie Buff`;
  }
  if (number > NOVICE) {
    return `Fun`;
  }
  if (number > 0) {
    return `Novice`;
  }
  return ``;
};

const getUserProfileTemplate = (title) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${title}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserProfile {
  constructor(number) {
    this._title = getUserTitle(number);
    this._element = null;
  }
  getTemplate() {
    return getUserProfileTemplate(this._title);
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
