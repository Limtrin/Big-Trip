import RouteComponent from './components/route.js';
import TotalComponent from './components/total.js';
import MenuComponent from './components/site-menu.js';
import {generateEventList} from './mock/event.js';
import {menuItems} from './mock/site-menu.js';
import {render, RenderPosition} from './utils/render.js';
import TripController from './controllers/trip.js';
import FilterController from './controllers/filter.js';
import EventsModel from './models/points.js';

const EVENT_COUNT = 5;


const events = generateEventList(EVENT_COUNT);
const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const siteRouteElement = document.querySelector(`.trip-main__trip-info`);
render(siteRouteElement, new TotalComponent(events), RenderPosition.BEFOREEND);
render(siteRouteElement, new RouteComponent(events), RenderPosition.AFTERBEGIN);


const siteControlsElement = document.querySelector(`.trip-main__trip-controls`);
render(siteControlsElement.firstElementChild, new MenuComponent(menuItems), RenderPosition.AFTEREND);

const filterController = new FilterController(siteControlsElement.lastElementChild, eventsModel);
filterController.render();

const siteMainElement = document.querySelector(`.trip-events`);

const tripController = new TripController(siteMainElement, eventsModel);
tripController.render();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => {
  tripController.createEvent();
});
