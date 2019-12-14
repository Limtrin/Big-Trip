import AbstractComponent from './abstract-class.js';

const createTripDayListTemplate = (date = 0, count = 0) => {
  const dateCount = date === 0 && count === 0 ? `<li class="trip-days__item  day">
  <div class="day__info">
  </div>

  <ul class="trip-events__list">
  </ul>
</li>` : `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${count}</span>
        <time class="day__date" datetime="${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}">${date.toLocaleDateString(`en-US`, {month: `short`})} ${date.getDate()}</time>
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>`;
  return dateCount;
};

export default class DayList extends AbstractComponent {
  constructor(date, count) {
    super();
    this._date = date;
    this._count = count;
  }

  getTemplate() {
    return createTripDayListTemplate(this._date, this._count);
  }
}
