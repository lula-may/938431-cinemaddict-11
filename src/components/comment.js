import AbstractComponent from "./abstract-component.js";
import {humanizeDate} from "../utils/common.js";

export default class Comment extends AbstractComponent {
  constructor(comment) {
    super();
    this._comment = comment;
  }

  getTemplate() {
    const {emotion, date, text, author} = this._comment;
    const commentDate = humanizeDate(date);
    const commentText = (!text) ? `` : text;
    return (
      `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${commentText}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${commentDate}</span>
            <button class="film-details__comment-delete" type="button">Delete</button>
          </p>
        </div>
      </li>`
    );
  }

  getComment() {
    return this._comment;
  }

  setDeleteButtonClickHandler(handler) {
    const button = this.getElement().querySelector(`.film-details__comment-delete`);
    button.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      handler();
    });
  }
}
