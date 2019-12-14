import {eventTypeTransfer, eventTypeActivity, cityList, offersList} from '../constants.js';
import {formatTime} from '../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component.js';

const textCapitalize = (text) => {
  return text[0].toUpperCase() + text.slice(1);
};

const createTypeListMarkup = (eventTypeList, currentType) => {
  return eventTypeList
  .map((eventTypeItem) => {
    return (
      `<div class="event__type-item">
        <input id="event-type-${eventTypeItem}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventTypeItem}" ${eventTypeItem === currentType ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${eventTypeItem}" for="event-type-${eventTypeItem}-1">${textCapitalize(eventTypeItem)}</label>
      </div>`
    );
  })
  .join(`\n`);
};

const createCityListMarkup = (cities) => {
  return cities
  .map((city) => {
    return (
      `<option value="${city.name}"></option>`
    );
  })
  .join(`\n`);
};

const createPhotoListMarkup = (photos) => {
  return photos
    .map((photo) => {
      return (
        `<img class="event__photo" src="${photo}" alt="Event photo"></img>`
      );
    })
    .join(`\n`);
};

const createOfferListMarkup = (offers) => {
  return offers
    .map((offer) => {
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.name}-1" type="checkbox" name="event-offer-${offer.name}" ${offer.isChosen ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${offer.name}-1">
            <span class="event__offer-title">${offer.desc}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`
      );
    })
    .join(`\n`);
};

const createEventEditTemplate = (event, options = {}) => {

  const {dateBegining, dateEnding, price, isFavorite} = event;

  const {type, offers, city} = options;

  const typePlaceholder = eventTypeTransfer.includes(type) ? `${textCapitalize(type)} to` : `${textCapitalize(type)} in`;

  const typeTransferMarkup = createTypeListMarkup(eventTypeTransfer, type);
  const typeActivityMarkup = createTypeListMarkup(eventTypeActivity, type);
  const photoesMarkup = createPhotoListMarkup(city.pictures);
  const offersMarkup = createOfferListMarkup(offers);

  return (
    `<form class="trip-events__item  event  event--edit" method="get">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
                ${typeTransferMarkup}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
               ${typeActivityMarkup}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${typePlaceholder}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createCityListMarkup(cityList)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatTime(dateBegining)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatTime(dateEnding)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">

      ${offersMarkup.length ? `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offersMarkup}
          </div>
        </section>` : ``}
        

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${city.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${photoesMarkup}
            </div>
          </div>
        </section>
      </section>
    </form>`
  );
};

export default class DayList extends AbstractSmartComponent {
  constructor(event) {
    super();
    this._event = event;

    this._type = event.type;
    this._offers = event.offers;
    this._city = event.city;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEventEditTemplate(this._event, {
      type: this._type,
      offers: this._offers,
      city: this._city
    });
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, handler);
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  reset() {
    const event = this._event;

    this._type = event.type;
    this._offers = event.offers;
    this._city = event.city;

    this.rerender();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const eventsList = element.querySelector(`.event__type-list`);
    if (eventsList) {
      eventsList.addEventListener(`change`, (evt) => {
        this._type = evt.target.value;
        this._offers = offersList.filter((it) => it.type === this._type);

        this.rerender();
      });
    }

    element.querySelector(`.event__input`).addEventListener(`change`, (evt) => {
      this._city = cityList.find((it) => it.name === evt.target.value);

      this.rerender();
    });
  }
}
