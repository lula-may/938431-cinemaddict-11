import AbstractComponent from "./abstract-component.js";

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(`Abstract method is not implemented: recoveryListeners`);
  }

  rerender() {
    const oldElement = this.getElement();
    this.removeElement();
    const parentElement = oldElement.parentElement;
    parentElement.replaceChild(this.getElement(), oldElement);
    this.recoveryListeners();
  }
}
