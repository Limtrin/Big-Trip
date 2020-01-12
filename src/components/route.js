import AbstractComponent from './abstract-class.js';

const createRouteTemplate = (events) => {

  let cityArray = [];
  let eventsDate = [];

  events.sort((a, b) => a.dateBegining - b.dateBegining).map((event) => {
    const {city, dateBegining} = event;
    cityArray.push(city.name);
    eventsDate.push(dateBegining);
  });

  cityArray = cityArray.filter((it, index) => index === cityArray.indexOf(it = it.trim()));

  let totalCost;

  switch (cityArray.length) {
    case 1:
      totalCost = `<h1 class="trip-info__title">${cityArray[0]}`;
      break;
    case 2:
      totalCost = `<h1 class="trip-info__title">${cityArray[0]} &mdash; ${cityArray[1]}`;
      break;
    case 3:
      totalCost = `<h1 class="trip-info__title">${cityArray[0]} &mdash; ${cityArray[1]} &mdash; ${cityArray[2]}</h1>`;
      break;
    default:
      totalCost = `<h1 class="trip-info__title">${cityArray[0]} &mdash; ... &mdash; ${cityArray[cityArray.length - 1]}</h1>`;
  }


  const renderTemplate = events === 0 ? `` : `<div class="trip-info__main">
                                                ${totalCost}
                                                <p class="trip-info__dates">${eventsDate[0].toLocaleDateString(`en-US`, {month: `short`})} ${eventsDate[0].getDate()}&nbsp;&mdash;&nbsp;${eventsDate[eventsDate.length - 1].toLocaleDateString(`en-US`, {month: `short`})} ${eventsDate[eventsDate.length - 1].getDate()}</p>
                                              </div>`;

  return renderTemplate;
};


export default class Route extends AbstractComponent {
  constructor() {
    super();
    this._events = null;
  }

  getTemplate() {
    return createRouteTemplate(this._events);
  }

  setEvents(events) {
    this._events = events;
  }
}
