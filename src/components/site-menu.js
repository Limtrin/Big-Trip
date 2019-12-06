import {createElement} from '../utils.js';

const createMenuMarkup = (items) => {
  return items
    .map((item) => {
      return (
        `<a class="trip-tabs__btn" href="#">${item}</a>`
      );
    })
    .join(`\n`);
};

const createSiteMenuTemplate = (menuItems) => {
  const menuMarkup = createMenuMarkup(menuItems);

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${menuMarkup}
    </nav>`
  );
};


export default class Menu {
  constructor(menuItems) {
    this._menuItems = menuItems;
    this._element = null;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._menuItems);
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
