import {render, remove, RenderPosition, replace} from '../utils/render.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/edit-event.js';
import {offersList} from '../constants.js';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyEvent = {
  type: `flight`,
  city: null,
  dateBegining: new Date(),
  dateEnding: new Date(),
  price: 0,
  offers: offersList.slice().map((it) => {
    return Object.assign({}, it);
  }).filter((it) => it.type === `flight`),
  isFavorite: false,
  isNew: true
};


export default class PointController {
  constructor(container, onDataChange, onViewChange, onFavoriteButtonChange) {
    this._container = container;
    this._eventComponent = null;
    this._eventEditComponent = null;

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
    this._eventEditComponent = new EventEditComponent(event);

    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
    });

    this._eventEditComponent.setEditButtonClickHandler(() => {
      this._replaceEditToEvent();
    });

    this._eventEditComponent.setFavoritesButtonClickHandler(() => {
      this._onFavoriteButtonChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite
      }));
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._eventEditComponent.getData();
      this._onDataChange(this, event, Object.assign({}, event, data));
    });
    this._eventEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, event, null));

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

  destroy() {
    remove(this._eventEditComponent);
    remove(this._eventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
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
      this._replaceEditToEvent();
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
