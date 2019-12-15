import {eventTypeTransfer} from '../constants.js';
import {formatTimeEvent, createDateDifference} from '../utils/common.js';
import AbstractComponent from './abstract-class.js';

const textCapitalize = (text) => {
  return text[0].toUpperCase() + text.slice(1);
};

const createOfferListMarkup = (offers) => {
  return offers
    .map((offer) => {
      return offer.isChosen ? `<li class="event__offer">
          <span class="event__offer-title">${offer.desc}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>` : ``;
    })
    .join(`\n`);
};

const createItemTemplate = (event) => {

  const {type, city, dateBegining, dateEnding, price, offers} = event;

  const typePlaceholder = eventTypeTransfer.includes(type) ? `${textCapitalize(type)} to ${city.name}` : `${textCapitalize(type)} in ${city.name}`;

  const createOffersMarkup = createOfferListMarkup(offers);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${typePlaceholder}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateBegining.toISOString()}">${formatTimeEvent(dateBegining)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateEnding.toISOString()}">${formatTimeEvent(dateEnding)}</time>
          </p>
          <p class="event__duration">${createDateDifference(dateBegining, dateEnding)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersMarkup}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event extends AbstractComponent {
  constructor(date) {
    super();
    this._date = date;
  }

  getTemplate() {
    return createItemTemplate(this._date);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
