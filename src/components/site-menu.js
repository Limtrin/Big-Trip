import AbstractComponent from "./abstract-class";

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


export default class Menu extends AbstractComponent {
  constructor(menuItems) {
    super();
    this._menuItems = menuItems;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._menuItems);
  }
}
