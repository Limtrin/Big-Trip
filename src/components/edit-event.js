import {eventTypeTransfer, eventTypeActivity, cityList} from '../constants.js';
import {formatTime} from '../utils.js';

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
      `<option value="${city}"></option>`
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
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.name}-1" type="checkbox" name="event-offer-${offer.name}">
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

export const createEventEditTemplate = (event) => {

  const {type, city, photos, description, dateBegining, dateEnding, price, offers} = event;

  const typePlaceholder = eventTypeTransfer.includes(type) ? `${textCapitalize(type)} to` : `${textCapitalize(type)} in`;

  const typeTransferMarkup = createTypeListMarkup(eventTypeTransfer, type);
  const typeActivityMarkup = createTypeListMarkup(eventTypeActivity, type);
  const photoesMarkup = createPhotoListMarkup(photos);
  const offersMarkup = createOfferListMarkup(offers);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
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
        <button class="event__reset-btn" type="reset">Cancel</button>
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
          <p class="event__destination-description">${description}</p>

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
