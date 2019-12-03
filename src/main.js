import {createRouteTemplate} from './components/route.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardTemplate} from './components/board.js';
import {createEventEditTemplate} from './components/edit-event.js';
import {createTripDayListTemplate} from './components/day-list.js';
import {createItemTemplate} from './components/event.js';
import {generateEvent, generateEventList} from './mock/event.js';
import {filterItems} from './mock/filter.js';
import {menuItems} from './mock/site-menu.js';


const EVENT_COUNT = 4;


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const events = generateEventList(EVENT_COUNT);
events.sort((a, b) => a.dateBegining - b.dateBegining);


const siteRouteElement = document.querySelector(`.trip-main__trip-info`);
render(siteRouteElement, createRouteTemplate(events.slice(1)), `beforeend`);

const siteControlsElement = document.querySelector(`.trip-main__trip-controls`);
render(siteControlsElement.firstElementChild, createSiteMenuTemplate(menuItems), `afterend`);
render(siteControlsElement.lastElementChild, createFilterTemplate(filterItems), `afterend`);

const siteMainElement = document.querySelector(`.trip-events`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const tripDayElement = siteMainElement.querySelector(`.trip-days`);
render(tripDayElement, createEventEditTemplate(events[0]), `beforebegin`);

render(tripDayElement, createTripDayListTemplate(events[0].dateBegining), `beforeend`);


const eventsListElement = tripDayElement.querySelector(`.trip-events__list`);
events
    .slice(1)
    .forEach(
        (item) => render(eventsListElement, createItemTemplate(item), `beforeend`)
    );
