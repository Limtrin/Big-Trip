import API from './api.js';
import MenuComponent from './components/site-menu.js';
import NewEventButtonComponent from './components/new-event-button.js';
import StatisticsComponent from './components/statistics.js';
import {render, RenderPosition} from './utils/render.js';
import TripController from './controllers/trip.js';
import FilterController from './controllers/filter.js';
import EventsModel from './models/points.js';
import DestinationsModel from './models/destinations.js';
import OffersModel from './models/offers.js';

const AUTHORIZATION = `Basic eo0w590ik29889a`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

const api = new API(END_POINT, AUTHORIZATION);

const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const eventsModel = new EventsModel();

const siteTripMain = document.querySelector(`.trip-main`);
const newEventButton = new NewEventButtonComponent();
render(siteTripMain, newEventButton, RenderPosition.BEFOREEND);

const siteControlsElement = document.querySelector(`.trip-main__trip-controls`);
const siteMenuComponent = new MenuComponent();
render(siteControlsElement.firstElementChild, siteMenuComponent, RenderPosition.AFTEREND);
const statisticsComponent = new StatisticsComponent(eventsModel.getEvents());

const filterController = new FilterController(siteControlsElement.lastElementChild, eventsModel);
filterController.render();

const siteMainElement = document.querySelector(`.trip-events`);

const tripController = new TripController(siteMainElement, eventsModel, destinationsModel, offersModel, api);
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

const getEvents = api.getEvents();
const getDestinations = api.getDestinations();
const getOffers = api.getOffers();

Promise.all([getOffers, getDestinations, getEvents])
  .then((res) => {
    const [offers, destinations, events] = res;

    offersModel.setOffers(offers);
    destinationsModel.setDestinations(destinations);

    eventsModel.setEvents(events);
    tripController.render();
  });
