import {createElement} from '../utils.js';

const createRouteTemplate = (events) => {
  let total = 0;

  events.map((event) => {
    const {price, offers} = event;
    total += price;
    offers.map((offer) => {
      total += offer.price;
    });
  });

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
    </p>`
  );
};


export default class Route {
  constructor(events) {
    this._events = events;
    this._element = null;
  }

  getTemplate() {
    return createRouteTemplate(this._events);
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
