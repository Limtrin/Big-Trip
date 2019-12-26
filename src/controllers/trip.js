import {render, RenderPosition} from '../utils/render.js';
import PointController from './point.js';
import NoEventsComponent from '../components/no-events.js';
import BoardComponent from '../components/board.js';
import SortComponent, {SortType} from '../components/sort.js';
import DayListComponent from '../components/day-list.js';
import {Mode as TaskControllerMode, EmptyEvent} from './point.js';

const HIDDEN_CLASS = `visually-hidden`;

// Метод рендеринга главной страницы
const renderEvents = (eventsList, tripDaysElement, onDataChange, onViewChange, onFavoriteButtonChange) => {

  let tripEventsElement;
  let currentDate = new Date();
  let count = 1;

  return eventsList
    .map(
        (event) => {
          if (currentDate.getDate() === event.dateBegining.getDate() && tripEventsElement) { // Если даты совпадают и контейнер определён - просто добавляем элемент
            const pointController = new PointController(tripEventsElement, onDataChange, onViewChange, onFavoriteButtonChange);
            pointController.render(event, TaskControllerMode.DEFAULT);
            return pointController;
          } else {
            const listComponent = new DayListComponent(event.dateBegining, count); // Если не совпадают или нет контейнера, то создаём новый компонент с информацией о дате
            render(tripDaysElement, listComponent, RenderPosition.BEFOREEND);
            tripEventsElement = listComponent.getElement().querySelector(`.trip-events__list`);

            const pointController = new PointController(tripEventsElement, onDataChange, onViewChange, onFavoriteButtonChange);
            pointController.render(event, TaskControllerMode.DEFAULT);

            currentDate = event.dateBegining;
            count++;

            return pointController;
          }
        }
    );
};

// Метод рендеринга страниц сортировки. Отличие в едином контейнере, который в свою очередь не выводит никакую инфрмацию о дате, он пустой, в компонент ничего не передали
const renderSortedEvents = (eventsList, tripDaysElement, onDataChange, onViewChange, onFavoriteButtonChange) => {
  const listComponent = new DayListComponent();
  render(tripDaysElement, listComponent, RenderPosition.BEFOREEND);
  const tripEventsElement = listComponent.getElement().querySelector(`.trip-events__list`);

  return eventsList
    .map(
        (event) => {
          const pointController = new PointController(tripEventsElement, onDataChange, onViewChange, onFavoriteButtonChange);
          pointController.render(event, TaskControllerMode.DEFAULT);
          return pointController;
        }
    );
};


export default class TripController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._sortMode = SortType.DEFAULT;

    this._sortComponent = new SortComponent();
    this._boardComponent = new BoardComponent();
    this._noEventsComponent = new NoEventsComponent();
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

    if (events.length === 0) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._boardComponent, RenderPosition.BEFOREEND);

    const tripDaysElement = this._container.querySelector(`.trip-days`);

    this._eventsList = renderEvents(events, tripDaysElement, this._onDataChange, this._onViewChange, this._onFavoriteButtonChange);
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }
    this._onViewChange();
    const tripDaysElement = this._container.querySelector(`.trip-days`);
    this._creatingEvent = new PointController(tripDaysElement, this._onDataChange, this._onViewChange, this._onFavoriteButtonChange);
    this._creatingEvent.render(EmptyEvent, TaskControllerMode.ADDING);
    this._eventsList.unshift(this._creatingEvent);
  }

  _updateEvents() {
    this._creatingEvent = null;
    this._removeEvents();
    if (this._sortMode === SortType.DEFAULT) {
      this._renderEvents();
    } else {
      this._onSortTypeChange(this._sortMode);
    }
  }

  _removeEvents() {
    const tripDaysElement = this._container.querySelector(`.trip-days`);
    tripDaysElement.innerHTML = ``;
  }

  _renderEvents(events = this._eventsModel.getEvents()) {
    const tripDaysElement = this._container.querySelector(`.trip-days`);
    this._eventsList = renderEvents(events, tripDaysElement, this._onDataChange, this._onViewChange, this._onFavoriteButtonChange);
  }

  _renderSortedEvents(events = this._eventsModel.getEvents()) {
    const tripDaysElement = this._container.querySelector(`.trip-days`);
    this._eventsList = renderSortedEvents(events, tripDaysElement, this._onDataChange, this._onViewChange, this._onFavoriteButtonChange);
  }

  _onSortTypeChange(sortType) {

    let sortedEvents = [];
    const events = this._eventsModel.getEvents();

    this._creatingEvent = null;
    this._sortMode = sortType;

    switch (sortType) {
      case SortType.TIME:
        sortedEvents = events.slice().sort((a, b) => (b.dateEnding.getTime() - b.dateBegining.getTime()) - (a.dateEnding.getTime() - a.dateBegining.getTime()));
        break;
      case SortType.PRICE:
        sortedEvents = events.slice().sort((a, b) => b.price - a.price);
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
        this._eventsModel.addEvent(newData);
        pointController.render(newData, TaskControllerMode.DEFAULT);
        this._updateEvents();
      }
    } else if (newData === null) {
      this._eventsModel.removeEvent(oldData.id);
      this._updateEvents();
    } else {
      const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);

      if (isSuccess) {
        this._updateEvents();
      }
    }
  }

  _onFavoriteButtonChange(pointController, oldData, newData) {
    this._eventsModel.updateEvent(oldData.id, newData);
    pointController.render(newData, TaskControllerMode.DEFAULT);
  }

  _onViewChange() {
    this._creatingEvent = null;
    this._eventsList.forEach((it) => it.setDefaultView());
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
