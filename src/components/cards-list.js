import AbstractComponent from "./abstract-component";
import {HIDDEN_CLASS} from "../const.js";

const getCardsListTemplate = () => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">Loading...</h2>
        <div class="films-list__container">
        </div>
      </section>
    </section>`
  );
};

export default class CardsList extends AbstractComponent {
  getTemplate() {
    return getCardsListTemplate();
  }

  showLoadingMessage() {
    const messageElement = this.getElement().querySelector(`.films-list__title`);
    messageElement.classList.remove(HIDDEN_CLASS);
  }
}
