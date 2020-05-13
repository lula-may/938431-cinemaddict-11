import AbstractComponent from "./abstract-component.js";

const NOVICE = 10;
const FAN = 20;

export const getUserTitle = (number) => {
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

export default class UserProfile extends AbstractComponent {
  constructor(number) {
    super();
    this._title = getUserTitle(number);
  }
  getTemplate() {
    return getUserProfileTemplate(this._title);
  }
}
