import {render, remove, RenderPosition, replace} from '../utils/render.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/edit-event.js';
import EventModel from '../models/event.js';
import moment from 'moment';

const SHAKE_ANIMATION_TIMEOUT = 600;

const parseFormData = (formData, destinationsList, offersList) => {

  const typeCity = JSON.parse(JSON.stringify(destinationsList)).filter((destinationItem) => destinationItem.name === formData.get(`event-destination`))[0];

  const changedOffers = JSON.parse(JSON.stringify(offersList)).filter((offerItem) => offerItem.type === formData.get(`event-type`));

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

  return new EventModel({
    'type': formData.get(`event-type`),
    'destination': typeCity,
    'date_from': moment(formData.get(`event-start-time`), `DD/MM/YYYY HH:mm`)._d,
    'date_to': moment(formData.get(`event-end-time`), `DD/MM/YYYY HH:mm`)._d,
    'base_price': Number(formData.get(`event-price`)),
    'offers': changedOffers[0].offers.filter((offer) => offer.isChosen === true),
    'is_favorite': Boolean(formData.get(`event-favorite`))
  });
};

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
  FAVORITE: `favorite`
};

export const EmptyEvent = {
  type: `flight`,
  city: null,
  dateBegining: new Date(),
  dateEnding: new Date(),
  price: 0,
  offers: [],
  isFavorite: false,
  isNew: true
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, onFavoriteButtonChange, destinations, offers) {
    this._container = container;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._destinations = destinations;
    this._offers = offers;

    this._mode = Mode.DEFAULT;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onFavoriteButtonChange = onFavoriteButtonChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, mode) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._mode = mode;

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event, this._destinations, this._offers);

    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
    });

    this._eventEditComponent.setEditButtonClickHandler(() => {
      this._replaceEditToEvent();
    });

    this._eventEditComponent.setFavoritesButtonClickHandler(() => {
      const formData = this._eventEditComponent.getData();
      const data = parseFormData(formData, this._destinations, this._offers);

      const newEvent = EventModel.clone(event);
      newEvent.isFavorite = !data.isFavorite;
      this._onFavoriteButtonChange(this, event, newEvent);
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();

      this._eventEditComponent.changeSaveButtonText(`Saving...`);
      this._eventEditComponent.switchButtonsBlock();

      const formData = this._eventEditComponent.getData();
      const data = parseFormData(formData, this._destinations, this._offers);
      this._onDataChange(this, event, data);
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      this._eventEditComponent.changeDeleteButtonText(`Deleting...`);
      this._eventEditComponent.switchButtonsBlock();

      this._onDataChange(this, event, null);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventEditComponent && oldEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
        } else {
          render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldEventEditComponent && oldEventComponent) {
          remove(oldEventComponent);
          remove(oldEventEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._eventEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  changeFavorite() {
    this._eventEditComponent.changeFavoriteStatus();
  }

  destroy() {
    remove(this._eventEditComponent);
    remove(this._eventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    this._eventEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._eventComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    this._eventEditComponent.getElement().style.border = `2px solid red`;
    this._eventComponent.getElement().style.border = `2px solid red`;

    setTimeout(() => {
      this._eventEditComponent.getElement().style.animation = ``;
      this._eventComponent.getElement().style.animation = ``;

      this._eventEditComponent.changeSaveButtonText(`Save`);
      this._eventEditComponent.changeDeleteButtonText(`Delete`);
      this._eventEditComponent.switchButtonsBlock();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  shakeForFavorite() {
    this._eventEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._eventComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    this._eventEditComponent.getElement().style.border = `2px solid red`;
    this._eventComponent.getElement().style.border = `2px solid red`;
    setTimeout(() => {
      this._eventEditComponent.getElement().style.animation = ``;
      this._eventComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._eventEditComponent.reset();

    replace(this._eventComponent, this._eventEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _replaceEventToEdit() {
    this._onViewChange();
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyEvent, null);
      }
      if (this._mode === Mode.EDIT) {
        this._replaceEditToEvent();
      }
    }
  }

  setDefaultView() {
    if (this._mode === Mode.EDIT) {
      this._replaceEditToEvent();
    }
    if (this._mode === Mode.ADDING) {
      this.destroy();
    }
  }
}
