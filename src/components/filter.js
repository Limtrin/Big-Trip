import {createElement} from '../utils.js';

const textCapitalize = (text) => {
  return text[0].toUpperCase() + text.slice(1);
};

const createFilterMarkup = (items) => {
  return items
    .map((item) => {
      return (
        `<div class="trip-filters__filter">
          <input id="filter-${item}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${item}" checked>
          <label class="trip-filters__filter-label" for="filter-everything">${textCapitalize(item)}</label>
        </div>`
      );
    })
    .join(`\n`);
};

const createFilterTemplate = (filterItems) => {

  const filterMarkup = createFilterMarkup(filterItems);

  return (
    `<form class="trip-filters  trip-filters" action="#" method="get">
        ${filterMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
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
