import {render, RenderPosition, replace} from '../utils/render.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/edit-event.js';
import NoEventsComponent from '../components/no-events.js';
import BoardComponent from '../components/board.js';
import SortComponent, {SortType} from '../components/sort.js';
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

    const renderEvents = (eventsList, tripDaysElement) => {

      let tripEventsElement;
      let currentDate = new Date();
      let count = 1;

      eventsList
        .forEach(
            (event) => {
              if (currentDate.getDay() === event.dateBegining.getDay()) {
                renderEvent(tripEventsElement, event);
              } else {
                const listComponent = new DayListComponent(event.dateBegining, count);
                render(tripDaysElement, listComponent, RenderPosition.BEFOREEND);
                tripEventsElement = listComponent.getElement().querySelector(`.trip-events__list`);
                renderEvent(tripEventsElement, event);
                currentDate = event.dateBegining;
                count++;
              }
            }
        );
    };

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._boardComponent, RenderPosition.BEFOREEND);

    const tripDaysElement = this._container.querySelector(`.trip-days`);

    renderEvents(events, tripDaysElement);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedEvents = [];

      switch (sortType) {
        case SortType.TIME:
          sortedEvents = events.slice().sort((a, b) => (b.dateEnding.getTime() - b.dateBegining.getTime()) - (a.dateEnding.getTime() - a.dateBegining.getTime()));
          break;
        case SortType.PRICE:
          sortedEvents = events.slice().sort((a, b) => b.price - a.price);
          break;
        case SortType.DEFAULT:
          sortedEvents = events.slice();
          break;
      }

      tripDaysElement.innerHTML = ``;

      if (sortType === SortType.DEFAULT) {
        renderEvents(events, tripDaysElement);
      } else {
        const listComponent = new DayListComponent();
        render(tripDaysElement, listComponent, RenderPosition.BEFOREEND);
        const tripEventsElement = listComponent.getElement().querySelector(`.trip-events__list`);
        sortedEvents.forEach((event) => renderEvent(tripEventsElement, event));
      }
    });
  }
}
