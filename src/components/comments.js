import AbstractSmartComponent from "./abstract-smart-component";
import CommentComponent from "./comment.js";
import {EMOTIONS} from "../const.js";
import {createElement, render} from "../utils/render.js";


const EMPTY_COMMENT = {
  id: ``,
  emotion: ``,
  date: ``,
  text: ``,
};

const getEmojiListMarkup = () => {
  return EMOTIONS.map((emotion) => {
    return (
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
      <label class="film-details__emoji-label" for="emoji-${emotion}">
        <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
      </label>`
    );
  }).join(`\n`);
};

export default class Comments extends AbstractSmartComponent {
  constructor(movie, onCommentsDataChange) {
    super();
    this._movie = movie;
    this._commentsModel = null;
    this._commentComponents = [];
    this._onCommentsDataChange = onCommentsDataChange;
    this._newComment = Object.assign({}, EMPTY_COMMENT);

  }

  getTemplate() {
    const commentsAmount = this._movie.comments.length;
    const emojiListMarkup = getEmojiListMarkup();

    return (
      `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">
        ${commentsAmount}</span>
      </h3>

      <ul class="film-details__comments-list">
      </ul>

      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label"></div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
        ${emojiListMarkup}
        </div>
      </div>
    </section>`
    );
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  renderComments(commentsModel) {
    this._commentsModel = commentsModel;
    const commentsContainer = this.getElement().querySelector(`.film-details__comments-list`);

    this._commentComponents = this._commentsModel.getComments().map((comment) => {
      return new CommentComponent(this._movie.id, comment);
    });

    this._commentComponents.forEach((component) => {
      render(commentsContainer, component);
    });

    this._subscribeOnEvents();
  }

  _renderCommentEmoji(emotion) {
    const template = `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">`;
    const emojiContainer = this.getElement().querySelector(`.film-details__add-emoji-label`);
    emojiContainer.innerHTML = ``;
    const emojiElement = createElement(template);
    emojiContainer.append(emojiElement);
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    // Обработчики нажатия на Delete
    this._commentComponents.forEach((comment) => {
      comment.setDeleteButtonClickHandler(() => {
        this._onCommentsDataChange(this._movieId, comment.getComment(), null);
      });
    });

    // Навешиваем обработчик клика по эмоджи
    const emoji = element.querySelector(`.film-details__emoji-list`);
    emoji.addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      const emotion = evt.target.value;
      this._renderCommentEmoji(emotion);
      this._newComment.emotion = emotion;
    });

    // Обработчик ввода текста комментария
    element.querySelector(`.film-details__comment-input`).addEventListener(`change`, (evt) => {
      this._newComment.text = evt.target.value;
    });

    // Обработчик отправки формы
    element.addEventListener(`keydown`, (evt) => {
      if (!((evt.ctrlKey || evt.metaKey) && evt.key === `Enter`) || !this._newComment.emotion) {
        return;
      }
      this._newComment.date = new Date();
      this._newComment.id = String(Math.round(new Date() * Math.random()));
      this._onCommentsDataChange(this._movie, null, this._newComment);
      this._newComment = Object.assign({}, EMPTY_COMMENT);
    });
  }

  rerender() {
    super.rerender();
    this.renderComments();
  }

  reset() {
    this._newComment = Object.assign({}, EMPTY_COMMENT);
    this.rerender();
  }

  error() {
    const errorMessage = `<div>Failed to load comments. Try again later...</div>`;
    this.getElement().querySelector(`h3`).insertAdjacentHTML(`afterend`, errorMessage);
  }
}
