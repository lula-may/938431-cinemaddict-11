import AbstractComponent from "./abstract-component.js";
import {humanizeDate} from "../utils/common.js";
import {encode} from "he";

const DefaultData = {
  deleteButtonText: `Delete`,
  isDeleteButtonBlocked: false
};

export default class Comment extends AbstractComponent {
  constructor(movieId, comment) {
    super();
    this._movieId = movieId;
    this._comment = comment;
    this._externalData = DefaultData;
  }

  getTemplate() {
    const {emotion, date, text: notSanitizedText, author} = this._comment;
    const text = encode(notSanitizedText);
    const commentDate = humanizeDate(date);
    const commentText = (!text) ? `` : text;
    const deleteButtonText = this._externalData.deleteButtonText;
    const isDeleteButtonBlocked = this._externalData.isDeleteButtonBlocked;
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
            <button class="film-details__comment-delete" type="button"${isDeleteButtonBlocked ? `disabled` : ``}>
              ${deleteButtonText}
            </button>
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

  setExternalData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
  }
}
