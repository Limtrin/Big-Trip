import {render, RenderPosition, replace} from '../utils/render.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/edit-event.js';
import NoEventsComponent from '../components/no-events.js';
import BoardComponent from '../components/board.js';
import SortComponent from '../components/sort.js';
import DayListComponent from '../components/day-list.js';


const renderEvent = (tripEventsElement, event) => {

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceEditToEvent = () => {
    replace(eventComponent, eventEditComponent);
  };

  const replaceEventToEdit = () => {
    replace(eventEditComponent, eventComponent);
  };

  const eventComponent = new EventComponent(event);
  eventComponent.setEditButtonClickHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const eventEditComponent = new EventEditComponent(event);
  eventEditComponent.setSubmitHandler(replaceEditToEvent);

  render(tripEventsElement, eventComponent, RenderPosition.BEFOREEND);
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._sortComponent = new SortComponent();
    this._boardComponent = new BoardComponent();
    this._noEventsComponent = new NoEventsComponent();
  }

  render(events) {
    if (events.length === 0) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._boardComponent, RenderPosition.BEFOREEND);

    const tripDayElement = this._container.querySelector(`.trip-days`);

    render(tripDayElement, new DayListComponent(events[0].dateBegining), RenderPosition.BEFOREEND);

    const tripEventsElement = this._container.querySelector(`.trip-events__list`);

    events
      .forEach(
          (event) => renderEvent(tripEventsElement, event)
      );
  }
}
