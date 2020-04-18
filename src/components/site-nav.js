import AbstractComponent from "./abstract-component.js";

export default class SiteNav extends AbstractComponent {
  getTemplate() {
    return (
      `<nav class="main-navigation">
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
    );
  }
}
