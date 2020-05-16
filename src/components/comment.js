import AbstractComponent from "./abstract-component.js";
import {humanizeDate} from "../utils/common.js";
import {encode} from "he";

export default class Comment extends AbstractComponent {
  constructor(movieId, comment) {
    super();
    this._movieId = movieId;
    this._comment = comment;
  }

  getTemplate() {
    const {emotion, date, text: notSanitizedText, author} = this._comment;
    const text = encode(notSanitizedText);
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
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName === `BUTTON`) {
        handler();
      }
    });
  }
}
