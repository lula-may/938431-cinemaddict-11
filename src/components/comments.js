import AbstractSmartComponent from "./abstract-smart-component";
import CommentComponent from "./comment.js";
import CommentModel from "../models/comment.js";
import {EMOTIONS} from "../const.js";
import {createElement, render, replace} from "../utils/render.js";

const ERROR_TIMEOUT = 600;

const EMPTY_COMMENT = new CommentModel({
  "emotion": ``,
  "date": null,
  "text": ``
});

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
    this._deletingComment = null;
    this._onCommentsDataChange = onCommentsDataChange;
    this._newComment = null;

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

  rerender() {
    super.rerender();
    this.renderComments();
  }

  disableFormElements() {
    const formElements = this.getElement().querySelectorAll(`textarea, input`);
    formElements.forEach((element) => {
      element.disabled = true;
    });
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
    // Обработчик нажатия на Delete
    this._commentComponents.forEach((comment) => {
      comment.setDeleteButtonClickHandler(() => {
        this._deletingComment = new CommentComponent(this._movie.id, comment.getComment());
        this._deletingComment.setExternalData({
          deleteButtonText: `Deleting...`,
          isDeleteButtonBlocked: true
        });
        replace(this._deletingComment, comment);
        this._onCommentsDataChange(this._movie.id, comment.getComment(), null);
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
      this._newComment = CommentModel.clone(EMPTY_COMMENT);
      this._newComment.emotion = emotion;
    });

    // Обработчик отправки формы
    element.addEventListener(`keydown`, (evt) => {
      const textareaElement = element.querySelector(`.film-details__comment-input`);
      const formIsEmpty = !textareaElement.value || !this._newComment.emotion;

      if (!((evt.ctrlKey || evt.metaKey) && evt.key === `Enter`) || formIsEmpty) {
        return;
      }
      this._newComment.text = textareaElement.value;
      this._newComment.date = new Date();
      this.disableFormElements();
      this._onCommentsDataChange(this._movie.id, null, this._newComment);
    });
  }

  _enableFormElements() {
    const formElements = this.getElement().querySelectorAll(`textarea, input`);
    formElements.forEach((element) => {
      element.disabled = false;
    });
  }

  onLoadCommentsError() {
    const errorMessage = `<div>Failed to load comments. Try again later...</div>`;
    this.getElement().querySelector(`h3`).insertAdjacentHTML(`afterend`, errorMessage);
    this.disableFormElements();
  }

  onAddCommentError() {
    const formElement = document.querySelector(`.film-details__inner`);
    const textareaElement = this.getElement().querySelector(`.film-details__comment-input`);
    textareaElement.style.boxShadow = `inset 0 0 5px 5px rgba(255, 0, 0, 1)`;
    formElement.classList.add(`shake`);
    setTimeout(() => {
      formElement.classList.remove(`shake`);
      textareaElement.style.boxShadow = ``;
      this._enableFormElements();
    }, ERROR_TIMEOUT);
  }

  onDeleteCommentError(id) {
    const deletingComment = this._commentComponents.find((comment) => comment.getComment().id === id);
    deletingComment.getElement().classList.add(`shake`);
    replace(deletingComment, this._deletingComment);
  }
}
