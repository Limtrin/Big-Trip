import RouteComponent from './components/route.js';
import TotalComponent from './components/total.js';
import MenuComponent from './components/site-menu.js';
import NewEventButtonComponent from './components/new-event-button.js';
import StatisticsComponent from './components/statistics.js';
import {generateEventList} from './mock/event.js';
import {render, RenderPosition} from './utils/render.js';
import TripController from './controllers/trip.js';
import FilterController from './controllers/filter.js';
import EventsModel from './models/points.js';

const EVENT_COUNT = 5;


const events = generateEventList(EVENT_COUNT);
const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const siteTripMain = document.querySelector(`.trip-main`);
const newEventButton = new NewEventButtonComponent();
render(siteTripMain, newEventButton, RenderPosition.BEFOREEND);

const siteRouteElement = document.querySelector(`.trip-main__trip-info`);
render(siteRouteElement, new TotalComponent(events), RenderPosition.BEFOREEND);
render(siteRouteElement, new RouteComponent(events), RenderPosition.AFTERBEGIN);


const siteControlsElement = document.querySelector(`.trip-main__trip-controls`);
const siteMenuComponent = new MenuComponent();
render(siteControlsElement.firstElementChild, siteMenuComponent, RenderPosition.AFTEREND);
const statisticsComponent = new StatisticsComponent(eventsModel.getEvents());

const filterController = new FilterController(siteControlsElement.lastElementChild, eventsModel);
filterController.render();

const siteMainElement = document.querySelector(`.trip-events`);

const tripController = new TripController(siteMainElement, eventsModel);
tripController.render();
render(siteMainElement, statisticsComponent, RenderPosition.AFTEREND);
statisticsComponent.hide();

newEventButton.setClickNewEventButtonChangeHandler(() => {
  tripController.createEvent();
  statisticsComponent.hide();
  tripController.show();
  filterController.show();
  siteMenuComponent.setTableActiveItem();
});

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case `Stats`:
      tripController.hide();
      filterController.hide();
      statisticsComponent.show(eventsModel.getEvents());
      break;
    case `Table`:
      statisticsComponent.hide();
      filterController.show();
      tripController.show();
      break;
  }
});
