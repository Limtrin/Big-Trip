import {render, RenderPosition, replace} from '../utils/render.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/edit-event.js';

export default class PointController {
  constructor(container, onDataChange) {
    this._container = container;
    this._eventComponent = null;
    this._eventEditComponent = null;

    this._onDataChange = onDataChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event);


    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite
      }));
    });

    this._eventEditComponent.setSubmitHandler(() => this._replaceEditToEvent());

    if (oldEventEditComponent && oldEventComponent) {
      replace(this._eventComponent, oldEventComponent);
      replace(this._eventEditComponent, oldEventEditComponent);
    } else {
      render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
    }
  }

  _replaceEditToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
  }

  _replaceEventToEdit() {
    replace(this._eventEditComponent, this._eventComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
