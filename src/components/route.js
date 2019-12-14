import AbstractComponent from './abstract-class.js';

const createRouteTemplate = (events) => {

  let cityArray = [];
  let eventsDate = [];

  events.map((event) => {
    const {city, dateBegining} = event;
    cityArray.push(city);
    eventsDate.push(dateBegining);
  });

  const renderTemplate = events === 0 ? `` : `<div class="trip-info__main">
                                                <h1 class="trip-info__title">${cityArray[0]} &mdash; ... &mdash; ${cityArray[cityArray.length - 1]}</h1>
                                                <p class="trip-info__dates">${eventsDate[0].toLocaleDateString(`en-US`, {month: `short`})} ${eventsDate[0].getDate()}&nbsp;&mdash;&nbsp;${eventsDate[eventsDate.length - 1].getDate()}</p>
                                              </div>`;

  return renderTemplate;
};


export default class Route extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createRouteTemplate(this._events);
  }
}
