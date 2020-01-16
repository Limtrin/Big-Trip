import AbstractComponent from './abstract-class.js';

const createRouteTemplate = (events) => {
  let total = 0;

  if (events) {
    events.map((event) => {
      const {price, offers} = event;
      total += price;
      offers.map((offer) => {
        if (offer.isChosen) {
          total += offer.price;
        }
      });
    });
  }

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
    </p>`
  );
};


export default class Total extends AbstractComponent {
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
