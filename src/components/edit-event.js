import debounce from 'lodash/debounce';
import {eventTypeTransfer, eventTypeActivity} from '../constants.js';
import {formatTime, textCapitalize} from '../utils/common.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import AbstractSmartComponent from './abstract-smart-component.js';
import moment from 'moment';

const DEBOUNCE_TIMEOUT = 500;

const DefaultData = {
  deleteButtonText: `Delete`,
  cancelButtonText: `Cancel`,
  saveButtonText: `Save`,
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
        `<img class="event__photo" src="${photo.src}" alt="${photo.description}"></img>`
      );
    })
    .join(`\n`);
};

const createOfferListMarkup = (offersList) => {
  return offersList
    .map((offerItem) => {
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerItem.title}-1" type="checkbox" name="event-offer-${offerItem.title}" ${offerItem.isChosen ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${offerItem.title}-1">
            <span class="event__offer-title">${offerItem.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offerItem.price}</span>
          </label>
        </div>`
      );
    })
    .join(`\n`);
};

const createEventEditTemplate = (options = {}) => {

  const {type, offers, city, isNew, destinationsList, offersList, externalData, dateBegining, dateEnding, price, isFavorite} = options;

  const typePlaceholder = eventTypeTransfer.includes(type) ? `${textCapitalize(type)} to` : `${textCapitalize(type)} in`;

  const typeTransferMarkup = type ? createTypeListMarkup(eventTypeTransfer, type) : ``;
  const typeActivityMarkup = type ? createTypeListMarkup(eventTypeActivity, type) : ``;
  const photoesMarkup = city ? createPhotoListMarkup(city.pictures) : ``;

  const changedOffers = JSON.parse(JSON.stringify(offersList));

  changedOffers[0].offers.map((offerItem) => {
    if (offers.map((offer) => offer.title).includes(offerItem.title)) {
      offerItem.isChosen = true;
    }
  });

  const deleteButtonText = isNew ? externalData.cancelButtonText : externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

  const offersMarkup = createOfferListMarkup(changedOffers[0].offers);

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city ? city.name : ``}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createCityListMarkup(destinationsList)}
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
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${city ? `` : `disabled`}>${saveButtonText}</button>
        <button class="event__reset-btn" type="reset">${deleteButtonText}</button>

        ${isNew ? `` : `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </label>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`}
      </header>
      ${city ? `<section class="event__details">
        ${offersMarkup.length ? `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offersMarkup}
          </div>
        </section>` : ``}
        

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${city ? city.description : ``}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${photoesMarkup}
            </div>
          </div>
        </section>
      </section>` : ``}
      
    </form>`
  );
};

export default class EditEvent extends AbstractSmartComponent {
  constructor(event, destinations, offers) {
    super();
    this._event = event;
    this._destinationsList = destinations;
    this._offersList = offers;

    this._type = event.type;
    this._offers = event.offers;
    this._city = event.city;
    this._isNew = event.isNew;
    this._dateBegining = event.dateBegining;
    this._dateEnding = event.dateEnding;
    this._price = event.price;
    this._isFavorite = event.isFavorite;
    this._flatpickr = null;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
    this._editButtonHandler = null;
    this._favoriteButtonHandler = null;
    this._externalData = DefaultData;

    this._applyFlatpickr();
    this._subscribeOnEvents();
    this._applyFlatpickerEndDate();
  }

  getTemplate() {
    return createEventEditTemplate({
      type: this._type,
      offers: this._offers,
      city: this._city,
      isNew: this._isNew,
      destinationsList: this._destinationsList,
      offersList: this._offersList.filter((offerItem) => offerItem.type === this._type),
      externalData: this._externalData,
      dateBegining: this._dateBegining,
      dateEnding: this._dateEnding,
      price: this._price,
      isFavorite: this._isFavorite
    });
  }

  changeFavoriteStatus(favoriteStatus) {
    this._isFavorite = favoriteStatus;
    this._saveFormChanges();
    this.rerender();
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const dateBeginingElement = this.getElement().querySelector(`#event-start-time-1`);
    this._flatpickr = flatpickr(dateBeginingElement, {
      allowInput: true,
      enableTime: true,
      dateFormat: `d/m/Y H:i`,
      defaultDate: this._dateBegining
    });

    const dateEndingElement = this.getElement().querySelector(`#event-end-time-1`);
    this._flatpickr = flatpickr(dateEndingElement, {
      allowInput: true,
      enableTime: true,
      dateFormat: `d/m/Y H:i`,
      minDate: this._dateBegining,
      defaultDate: this._dateEnding
    });
  }

  _applyFlatpickerEndDate() {
    const dateBeginingElement = this.getElement().querySelector(`#event-start-time-1`);
    const dateEndingElement = this.getElement().querySelector(`#event-end-time-1`);

    dateBeginingElement.addEventListener(`change`, () => {
      this._flatpickr = flatpickr(dateEndingElement, {
        allowInput: true,
        enableTime: true,
        dateFormat: `d/m/Y H:i`,
        minDate: this.getData().get(`event-start-time`),
        defaultDate: this.getData().get(`event-end-time`)
      });
    });
  }

  getData() {
    const form = this.getElement();
    return new FormData(form);
  }

  _saveFormChanges() {
    const formData = new FormData(this.getElement());

    const changedOffers = JSON.parse(JSON.stringify(this._offersList)).filter((it) => it.type === formData.get(`event-type`));

    const chosenOffers = [];

    changedOffers[0].offers.forEach((changedOffer) => {
      chosenOffers.push(formData.get(`event-offer-${changedOffer.title}`));
    });

    changedOffers[0].offers.forEach((changedOffer, index) => {
      if (chosenOffers[index]) {
        changedOffer.isChosen = true;
      } else {
        changedOffer.isChosen = false;
      }
    });

    this._type = formData.get(`event-type`);
    this._dateBegining = moment(formData.get(`event-start-time`), `DD/MM/YYYY HH:mm`)._d;
    this._dateEnding = moment(formData.get(`event-end-time`), `DD/MM/YYYY HH:mm`)._d;
    this._price = formData.get(`event-price`);
    this._offers = changedOffers[0].offers.filter((offer) => offer.isChosen === true);
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  changeSaveButtonText(text) {
    this.getElement().querySelector(`.event__save-btn`).innerHTML = text;
  }

  changeDeleteButtonText(text) {
    this.getElement().querySelector(`.event__reset-btn`).innerHTML = text;
  }

  switchButtonsBlock() {
    const saveButton = this.getElement().querySelector(`.event__save-btn`);
    const removeButton = this.getElement().querySelector(`.event__reset-btn`);
    if (saveButton.hasAttribute(`disabled`) || removeButton.hasAttribute(`disabled`)) {
      saveButton.removeAttribute(`disabled`);
      removeButton.removeAttribute(`disabled`);
    } else {
      saveButton.setAttribute(`disabled`, `disabled`);
      removeButton.setAttribute(`disabled`, `disabled`);
    }
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setEditButtonClickHandler(handler) {
    if (!this._isNew) {
      this.getElement().querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, handler);

      this._editButtonHandler = handler;
    }
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setFavoritesButtonClickHandler(handler) {
    if (!this._isNew) {
      this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
    }

    this._favoriteButtonHandler = handler;
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }


  recoveryListeners() {
    this.setFavoritesButtonClickHandler(this._favoriteButtonHandler);
    this.setSubmitHandler(this._submitHandler);
    this.setEditButtonClickHandler(this._editButtonHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
    this._applyFlatpickr();
    this._applyFlatpickerEndDate();
  }

  reset() {
    const event = this._event;

    this._type = event.type;
    this._offers = event.offers;
    this._city = event.city;
    this._dateBegining = event.dateBegining;
    this._dateEnding = event.dateEnding;
    this._price = event.price;

    this.rerender();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const eventsList = element.querySelector(`.event__type-list`);
    if (eventsList) {
      eventsList.addEventListener(`change`, (evt) => {
        this._type = evt.target.value;
        this._offers = this._offersList.filter((offerItem) => offerItem.type === this._type);

        this._saveFormChanges();
        this.rerender();
      });
    }

    element.querySelector(`.event__input`).addEventListener(`change`, (evt) => {
      this._city = this._destinationsList.find((destinationItem) => destinationItem.name === evt.target.value);

      this._saveFormChanges();
      this.rerender();
    });
  }
}
