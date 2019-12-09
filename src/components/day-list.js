import {createElement} from '../utils.js';

const createTripDayListTemplate = (date) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">1</span>
        <time class="day__date" datetime="${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}">${date.toLocaleDateString(`en-US`, {month: `short`})} ${date.getDay()}</time>
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default class DayList {
  constructor(date) {
    this._date = date;
    this._element = null;
  }

  getTemplate() {
    return createTripDayListTemplate(this._date);
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
