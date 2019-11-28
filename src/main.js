import {createRouteTemplate} from './components/route.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardTemplate} from './components/board.js';
import {createEventEditTemplate} from './components/edit-event.js';
import {createTripDayListTemplate} from './components/day-list.js';
import {createItemTemplate} from './components/event.js';


const EVENT_COUNT = 3;


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


const siteRouteElement = document.querySelector(`.trip-main__trip-info`);
render(siteRouteElement, createRouteTemplate(), `beforeend`);

const siteControlsElement = document.querySelector(`.trip-main__trip-controls`);
render(siteControlsElement.firstElementChild, createSiteMenuTemplate(), `afterend`);
render(siteControlsElement.lastElementChild, createFilterTemplate(), `afterend`);

const siteMainElement = document.querySelector(`.trip-events`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const tripDayElement = siteMainElement.querySelector(`.trip-days`);
render(tripDayElement, createEventEditTemplate(), `beforebegin`);
render(tripDayElement, createTripDayListTemplate(), `beforeend`);

const eventsListElement = tripDayElement.querySelector(`.trip-events__list`);
new Array(EVENT_COUNT)
    .fill(``)
    .forEach(
        () => render(eventsListElement, createItemTemplate(), `beforeend`)
    );
