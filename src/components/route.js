import AbstractComponent from './abstract-class.js';

const createRouteTemplate = (events) => {

  let cities = [];
  let eventsDates = [];

  events.sort((currentItem, nextItem) => currentItem.dateBegining - nextItem.dateBegining).map((event) => {
    const {city, dateBegining} = event;
    cities.push(city.name);
    eventsDates.push(dateBegining);
  });

  const filteredCities = cities.filter((cityItem, index) => index === cities.indexOf(cityItem = cityItem.trim()));

  let totalCost;

  switch (filteredCities.length) {
    case 1:
      totalCost = `<h1 class="trip-info__title">${filteredCities[0]}`;
      break;
    case 2:
      totalCost = `<h1 class="trip-info__title">${filteredCities[0]} &mdash; ${filteredCities[1]}`;
      break;
    case 3:
      totalCost = `<h1 class="trip-info__title">${filteredCities[0]} &mdash; ${filteredCities[1]} &mdash; ${cities[cities.length - 1]}</h1>`;
      break;
    default:
      totalCost = `<h1 class="trip-info__title">${filteredCities[0]} &mdash; ... &mdash; ${cities[cities.length - 1]}</h1>`;
  }


  const renderTemplate = events === 0 ? `` : `<div class="trip-info__main">
                                                ${totalCost}
                                                <p class="trip-info__dates">${eventsDates[0].toLocaleDateString(`en-US`, {month: `short`})} ${eventsDates[0].getDate()}&nbsp;&mdash;&nbsp;${eventsDates[eventsDates.length - 1].toLocaleDateString(`en-US`, {month: `short`})} ${eventsDates[eventsDates.length - 1].getDate()}</p>
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
