import {filterItems} from '../constants';
import {getEventsByFilter} from '../utils/filter.js';

export default class EventsModel {
  constructor() {
    this._events = [];
    this._activateFilterType = filterItems.EVERITHING;

    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  getEvents() {
    return getEventsByFilter(this._events, this._activateFilterType);
  }

  getEventsAll() {
    return this._events;
  }

  setEvents(events) {
    this._events = Array.from(this._sortEvents(events));
  }

  addEvent(event) {
    this._events = this._sortEvents([].concat(event, this._events));
    this._callHandlers(this._dataChangeHandlers);
  }

  updateEvent(id, event) {
    const index = this._events.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), event, this._events.slice(index + 1));
    this._sortEvents(this._events);

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  removeEvent(id) {
    const index = this._events.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), this._events.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilter(filterType) {
    this._activateFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  getFilter() {
    return this._activateFilterType;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  _sortEvents(events) {
    return events.sort((a, b) => a.dateBegining - b.dateBegining);
  }
}
