import Api from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import MenuComponent from './components/site-menu.js';
import NewEventButtonComponent from './components/new-event-button.js';
import TotalComponent from './components/total.js';
import LoadingComponent from './components/loading.js';
import StatisticsComponent from './components/statistics.js';
import {render, RenderPosition} from './utils/render.js';
import TripController from './controllers/trip.js';
import FilterController from './controllers/filter.js';
import EventsModel from './models/events.js';
import DestinationsModel from './models/destinations.js';
import OffersModel from './models/offers.js';

const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const AUTHORIZATION = `Basic eo0w590ik29889a`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const getEvents = apiWithProvider.getEvents();
const getDestinations = apiWithProvider.getDestinations();
const getOffers = apiWithProvider.getOffers();

const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const eventsModel = new EventsModel();
const newEventButton = new NewEventButtonComponent();
const siteMenuComponent = new MenuComponent();
const totalComponent = new TotalComponent();
const statisticsComponent = new StatisticsComponent(eventsModel.getEventsAll());
const loadingComponent = new LoadingComponent();

const siteRouteElement = document.querySelector(`.trip-main__trip-info`);

const siteControlsElement = document.querySelector(`.trip-main__trip-controls`);
const filterController = new FilterController(siteControlsElement.lastElementChild, eventsModel);

const siteMainElement = document.querySelector(`.trip-events`);
const tripController = new TripController(siteMainElement, eventsModel, destinationsModel, offersModel, apiWithProvider);

const siteTripMain = document.querySelector(`.trip-main`);

render(siteMainElement, loadingComponent, RenderPosition.BEFOREEND);
render(siteRouteElement, totalComponent, RenderPosition.BEFOREEND);
render(siteTripMain, newEventButton, RenderPosition.BEFOREEND);
render(siteControlsElement.firstElementChild, siteMenuComponent, RenderPosition.AFTEREND);
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
      if (eventsModel.getEventsAll().length === 0) {
        break;
      }
      tripController.hide();
      filterController.hide();

      statisticsComponent.show(eventsModel.getEventsAll());
      break;
    case `Table`:
      statisticsComponent.hide();
      filterController.show();
      tripController.show();
      break;
  }
});

Promise.all([getOffers, getDestinations, getEvents])
  .then((res) => {
    const [offers, destinations, events] = res;

    offersModel.setOffers(offers);
    destinationsModel.setDestinations(destinations);
    eventsModel.setEvents(events);

    loadingComponent.removeElement();

    filterController.render(events);
    tripController.render();
  });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync();
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
