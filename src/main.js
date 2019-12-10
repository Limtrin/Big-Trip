import RouteComponent from './components/route.js';
import TotalComponent from './components/total.js';
import MenuComponent from './components/site-menu.js';
import FilterComponent from './components/filter.js';
import BoardComponent from './components/board.js';
import SortComponent from './components/sort.js';
import EventEditComponent from './components/edit-event.js';
import DayListComponent from './components/day-list.js';
import EventComponent from './components/event.js';
import NoEventsComponent from './components/no-events.js';
import {generateEventList} from './mock/event.js';
import {filterItems} from './mock/filter.js';
import {menuItems} from './mock/site-menu.js';
import {render, RenderPosition} from './utils.js';

const EVENT_COUNT = 0;


const renderEvent = (tripEventsElement, event) => {

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceEditToEvent = () => {
    tripEventsElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const replaceEventToEdit = () => {
    tripEventsElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const eventComponent = new EventComponent(event);
  const editButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, () => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });


  const eventEditComponent = new EventEditComponent(event);
  const editForm = eventEditComponent.getElement();
  editForm.addEventListener(`submit`, replaceEditToEvent);

  render(tripEventsElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

const events = generateEventList(EVENT_COUNT);
events.sort((a, b) => a.dateBegining - b.dateBegining);

const siteRouteElement = document.querySelector(`.trip-main__trip-info`);
render(siteRouteElement, new TotalComponent(events).getElement(), RenderPosition.BEFOREEND);

const siteControlsElement = document.querySelector(`.trip-main__trip-controls`);
render(siteControlsElement.firstElementChild, new MenuComponent(menuItems).getElement(), RenderPosition.AFTEREND);
render(siteControlsElement.lastElementChild, new FilterComponent(filterItems).getElement(), RenderPosition.AFTEREND);

const siteMainElement = document.querySelector(`.trip-events`);

if (events.length === 0) {
  render(siteMainElement, new NoEventsComponent().getElement(), RenderPosition.BEFOREEND);
} else {
  render(siteRouteElement, new RouteComponent(events).getElement(), RenderPosition.AFTERBEGIN);
  render(siteMainElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);
  render(siteMainElement, new BoardComponent().getElement(), RenderPosition.BEFOREEND);


  const tripDayElement = siteMainElement.querySelector(`.trip-days`);

  render(tripDayElement, new DayListComponent(events[0].dateBegining).getElement(), RenderPosition.BEFOREEND);

  const tripEventsElement = siteMainElement.querySelector(`.trip-events__list`);

  events
      .forEach(
          (event) => renderEvent(tripEventsElement, event)
      );
}
