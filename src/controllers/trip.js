import {render, RenderPosition} from '../utils/render.js';
import RouteComponent from '../components/route.js';
import TotalComponent from '../components/total.js';
import PointController from './point.js';
import NoEventsComponent from '../components/no-events.js';
import BoardComponent from '../components/board.js';
import SortComponent, {SortType} from '../components/sort.js';
import DayListComponent from '../components/day-list.js';
import {Mode as EventControllerMode, EmptyEvent} from './point.js';

const HIDDEN_CLASS = `visually-hidden`;

// Метод рендеринга главной страницы
const renderEvents = (eventsList, tripDaysElement, onDataChange, onViewChange, onFavoriteButtonChange, destinations, offers) => {

  let tripEventsElement;
  let currentDate = new Date();
  let count = 1;

  return eventsList
    .map(
        (event) => {
          if (currentDate.getDate() === event.dateBegining.getDate() && tripEventsElement) { // Если даты совпадают и контейнер определён - просто добавляем элемент
            const pointController = new PointController(tripEventsElement, onDataChange, onViewChange, onFavoriteButtonChange, destinations, offers);
            pointController.render(event, EventControllerMode.DEFAULT);
            return pointController;
          } else {
            const listComponent = new DayListComponent(event.dateBegining, count); // Если не совпадают или нет контейнера, то создаём новый компонент с информацией о дате
            render(tripDaysElement, listComponent, RenderPosition.BEFOREEND);
            tripEventsElement = listComponent.getElement().querySelector(`.trip-events__list`);

            const pointController = new PointController(tripEventsElement, onDataChange, onViewChange, onFavoriteButtonChange, destinations, offers);
            pointController.render(event, EventControllerMode.DEFAULT);

            currentDate = event.dateBegining;
            count++;

            return pointController;
          }
        }
    );
};

// Метод рендеринга страниц сортировки. Отличие в едином контейнере, который в свою очередь не выводит никакую инфрмацию о дате, он пустой, в компонент ничего не передали
const renderSortedEvents = (eventsList, tripDaysElement, onDataChange, onViewChange, onFavoriteButtonChange, destinations, offers) => {
  const listComponent = new DayListComponent();
  render(tripDaysElement, listComponent, RenderPosition.BEFOREEND);
  const tripEventsElement = listComponent.getElement().querySelector(`.trip-events__list`);

  return eventsList
    .map(
        (event) => {
          const pointController = new PointController(tripEventsElement, onDataChange, onViewChange, onFavoriteButtonChange, destinations, offers);
          pointController.render(event, EventControllerMode.DEFAULT);
          return pointController;
        }
    );
};


export default class TripController {
  constructor(container, eventsModel, destinationsModel, offersModel, api) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._sortMode = SortType.DEFAULT;
    this._api = api;

    this._sortComponent = new SortComponent();
    this._boardComponent = new BoardComponent();
    this._noEventsComponent = new NoEventsComponent();
    this._totalComponent = new TotalComponent();
    this._routeComponent = new RouteComponent();
    this._onDataChange = this._onDataChange.bind(this);
    this._onFavoriteButtonChange = this._onFavoriteButtonChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._creatingEvent = null;

    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render() {
    const events = this._eventsModel.getEvents();

    if (this._eventsModel.getEventsAll().length === 0) {
      this._createNoEvents();
      return;
    }

    this._createSortAndBoard();
    this._updateTotalAndRoute(events);

    const tripDaysElement = this._container.querySelector(`.trip-days`);
    this._eventsList = renderEvents(events, tripDaysElement, this._onDataChange, this._onViewChange, this._onFavoriteButtonChange, this._destinationsModel.getDestinations(), this._offersModel.getOffers());
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }
    this._onViewChange();
    if (!this._container.querySelector(`.trip-days`)) {
      this._container.innerHTML = ``;
      render(this._container, this._boardComponent, RenderPosition.BEFOREEND);
    }
    const tripDaysElement = this._container.querySelector(`.trip-days`);
    this._creatingEvent = new PointController(tripDaysElement, this._onDataChange, this._onViewChange, this._onFavoriteButtonChange, this._destinationsModel.getDestinations(), this._offersModel.getOffers());
    this._creatingEvent.render(EmptyEvent, EventControllerMode.ADDING);
    if (this._eventsList) {
      this._eventsList.unshift(this._creatingEvent);
    }
  }

  _createNoEvents() {
    this._container.innerHTML = ``;
    render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
  }

  _createSortAndBoard() {
    this._container.innerHTML = ``;
    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._boardComponent, RenderPosition.BEFOREEND);
  }

  _updateTotalAndRoute(events) {
    this._totalComponent.removeElement();
    this._routeComponent.removeElement();

    this._totalComponent.setEvents(events);
    this._routeComponent.setEvents(events);

    const siteRouteElement = document.querySelector(`.trip-main__trip-info`);
    siteRouteElement.innerHTML = ``;

    render(siteRouteElement, this._totalComponent, RenderPosition.BEFOREEND);
    render(siteRouteElement, this._routeComponent, RenderPosition.AFTERBEGIN);
  }

  _updateEvents() {
    this._creatingEvent = null;
    this._removeEvents();
    if (this._eventsModel.getEventsAll().length === 0) {
      this._createNoEvents();
      return;
    }
    if (this._sortMode === SortType.DEFAULT) {
      this._renderEvents();
    } else {
      this._onSortTypeChange(this._sortMode);
    }
  }

  _removeEvents() {
    if (this._container.querySelector(`.trip-days`)) {
      const tripDaysElement = this._container.querySelector(`.trip-days`);
      tripDaysElement.innerHTML = ``;
    }
  }

  _renderEvents(events = this._eventsModel.getEvents()) {
    if (!this._container.querySelector(`.trip-sort`)) {
      this._createSortAndBoard();
    }
    const tripDaysElement = this._container.querySelector(`.trip-days`);
    this._eventsList = renderEvents(events, tripDaysElement, this._onDataChange, this._onViewChange, this._onFavoriteButtonChange, this._destinationsModel.getDestinations(), this._offersModel.getOffers());
  }

  _renderSortedEvents(events = this._eventsModel.getEvents()) {
    if (!this._container.querySelector(`.trip-sort`)) {
      this._createSortAndBoard();
    }
    const tripDaysElement = this._container.querySelector(`.trip-days`);
    this._eventsList = renderSortedEvents(events, tripDaysElement, this._onDataChange, this._onViewChange, this._onFavoriteButtonChange, this._destinationsModel.getDestinations(), this._offersModel.getOffers());
  }

  _onSortTypeChange(sortType) {

    let sortedEvents = [];
    const events = this._eventsModel.getEvents();

    this._creatingEvent = null;
    this._sortMode = sortType;

    switch (sortType) {
      case SortType.TIME:
        sortedEvents = events.slice().sort((currtntEvent, nextEvent) => (nextEvent.dateEnding.getTime() - nextEvent.dateBegining.getTime()) - (currtntEvent.dateEnding.getTime() - currtntEvent.dateBegining.getTime()));
        break;
      case SortType.PRICE:
        sortedEvents = events.slice().sort((currtntEvent, nextEvent) => nextEvent.price - currtntEvent.price);
        break;
      case SortType.DEFAULT:
        sortedEvents = events.slice();
        break;
    }

    this._removeEvents();

    if (sortType === SortType.DEFAULT) {
      this._renderEvents(sortedEvents);
    } else {
      this._renderSortedEvents(sortedEvents);
    }
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyEvent) {
      this._creatingEvent = null;
      if (newData === null) {
        pointController.destroy();
        this._updateEvents();
      } else {
        this._api.createEvent(newData)
          .then((eventModel) => {
            this._eventsModel.addEvent(eventModel);
            pointController.render(eventModel, EventControllerMode.DEFAULT);
            this._updateEvents();
            this._updateTotalAndRoute(this._eventsModel.getEventsAll());
          })
          .catch(() => {
            pointController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deleteEvent(oldData.id)
          .then(() => {
            this._eventsModel.removeEvent(oldData.id);
            this._updateEvents();
            this._updateTotalAndRoute(this._eventsModel.getEventsAll());
          })
          .catch(() => {
            pointController.shake();
          });
    } else {
      this._api.updateEvent(oldData.id, newData)
        .then((eventModel) => {
          const isSuccess = this._eventsModel.updateEvent(oldData.id, eventModel);
          if (isSuccess) {
            this._updateEvents();
            this._updateTotalAndRoute(this._eventsModel.getEventsAll());
          }
        })
        .catch(() => {
          pointController.shake();
        });
    }
  }

  _onFavoriteButtonChange(pointController, oldData, newData) {
    this._api.updateEvent(oldData.id, newData)
      .then((eventModel) => {
        this._eventsModel.updateEvent(oldData.id, eventModel);
      })
      .catch(() => {
        pointController.shakeForFavorite();
      });
  }

  _onViewChange() {
    this._creatingEvent = null;
    if (this._eventsList) {
      this._eventsList.forEach((eventItem) => eventItem.setDefaultView());
    }
  }

  _onFilterChange() {
    this._updateEvents();
  }

  hide() {
    this._container.classList.add(HIDDEN_CLASS);
  }

  show() {
    this._container.classList.remove(HIDDEN_CLASS);
  }
}
