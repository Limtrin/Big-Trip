import RouteComponent from './components/route.js';
import TotalComponent from './components/total.js';
import MenuComponent from './components/site-menu.js';
import FilterComponent from './components/filter.js';
import {generateEventList} from './mock/event.js';
import {filterItems} from './mock/filter.js';
import {menuItems} from './mock/site-menu.js';
import {render, RenderPosition} from './utils/render.js';
import TripController from './controllers/trip.js';

const EVENT_COUNT = 5;


const events = generateEventList(EVENT_COUNT);
events.sort((a, b) => a.dateBegining - b.dateBegining);

const siteRouteElement = document.querySelector(`.trip-main__trip-info`);
render(siteRouteElement, new TotalComponent(events), RenderPosition.BEFOREEND);
render(siteRouteElement, new RouteComponent(events), RenderPosition.AFTERBEGIN);


const siteControlsElement = document.querySelector(`.trip-main__trip-controls`);
render(siteControlsElement.firstElementChild, new MenuComponent(menuItems), RenderPosition.AFTEREND);
render(siteControlsElement.lastElementChild, new FilterComponent(filterItems), RenderPosition.AFTEREND);

const siteMainElement = document.querySelector(`.trip-events`);

const tripController = new TripController(siteMainElement, events);
tripController.render(events);
