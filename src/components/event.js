import {eventTypeTransfer} from '../constants.js';
import {formatTimeEvent, createDateDifference} from '../utils/common.js';
import AbstractComponent from './abstract-class.js';

const textCapitalize = (text) => {
  if (text) {
    return text[0].toUpperCase() + text.slice(1);
  } else {
    return ``;
  }
};

const createOfferListMarkup = (offersList) => {
  return offersList
    .map((offerItem) => {
      return offerItem ? `<li class="event__offer">
          <span class="event__offer-title">${offerItem.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offerItem.price}</span>
        </li>` : ``;
    })
    .join(`\n`);
};

const createItemTemplate = (event) => {

  const {type, city, dateBegining, dateEnding, price, offers} = event;

  const typePlaceholder = eventTypeTransfer.includes(type) ? `${textCapitalize(type)} to ${city ? city.name : ``}` : `${textCapitalize(type)} in ${city ? city.name : ``}`;

  const createOffersMarkup = offers ? createOfferListMarkup(offers.slice(0, 3)) : ``;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${typePlaceholder}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="">${formatTimeEvent(dateBegining)}</time>
            &mdash;
            <time class="event__end-time" datetime="">${formatTimeEvent(dateEnding)}</time>
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
  constructor(event, offers) {
    super();
    this._event = event;
    this._offers = offers;
  }

  getTemplate() {
    return createItemTemplate(this._event, this._offers);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
