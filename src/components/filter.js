import AbstractComponent from "./abstract-class";
import {textCapitalize} from "../utils/common.js";

const createFilterMarkup = (items) => {
  return Object.values(items)
    .map((item) => {
      return (
        `<div class="trip-filters__filter">
          <input id="filter-${item.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${item.name}" ${item.checked ? `checked` : ``}>
          <label class="trip-filters__filter-label" for="filter-everything">${textCapitalize(item.name)}</label>
        </div>`
      );
    })
    .join(`\n`);
};

const createFilterTemplate = (items) => {

  const filterMarkup = createFilterMarkup(items);

  return (
    `<form class="trip-filters  trip-filters" action="#" method="get">
        ${filterMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `LABEL`) {
        return;
      }
      const filterName = evt.target.parentNode.querySelector(`input`).value;
      handler(filterName);
    });
  }
}
