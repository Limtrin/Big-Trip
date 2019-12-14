import {render, RenderPosition} from '../utils/render.js';
import PointController from './point.js';
import NoEventsComponent from '../components/no-events.js';
import BoardComponent from '../components/board.js';
import SortComponent, {SortType} from '../components/sort.js';
import DayListComponent from '../components/day-list.js';


// Метод рендеринга главной страницы
const renderEvents = (eventsList, tripDaysElement, onDataChange) => {

  let tripEventsElement;
  let currentDate = new Date();
  let count = 1;

  eventsList
    .forEach(
        (event) => {
          if (currentDate.getDate() === event.dateBegining.getDate() && tripEventsElement) { // Если даты совпадают и контейнер определён - просто добавляем элемент
            const pointController = new PointController(tripEventsElement, onDataChange);
            pointController.render(event);
          } else {
            const listComponent = new DayListComponent(event.dateBegining, count); // Если не совпадают или нет контейнера, то создаём новый компонент с информацией о дате
            render(tripDaysElement, listComponent, RenderPosition.BEFOREEND);
            tripEventsElement = listComponent.getElement().querySelector(`.trip-events__list`);

            const pointController = new PointController(tripEventsElement, onDataChange);
            pointController.render(event);

            currentDate = event.dateBegining;
            count++;
          }
        }
    );
};

// Метод рендеринга страниц сортировки. Отличие в едином контейнере, который в свою очередь не выводит никакую инфрмацию о дате, он пустой, в компонент ничего не передали
const renderSortedEvents = (eventsList, tripDaysElement, onDataChange) => {
  const listComponent = new DayListComponent();
  render(tripDaysElement, listComponent, RenderPosition.BEFOREEND);
  const tripEventsElement = listComponent.getElement().querySelector(`.trip-events__list`);

  eventsList
    .forEach(
        (event) => {
          const pointController = new PointController(tripEventsElement, onDataChange);
          pointController.render(event);
        }
    );
};


export default class TripController {
  constructor(container) {
    this._container = container;

    this._events = [];
    this._sortComponent = new SortComponent();
    this._boardComponent = new BoardComponent();
    this._noEventsComponent = new NoEventsComponent();
    this._onDataChange = this._onDataChange.bind(this);
  }

  render(events) {
    this._events = events.sort((a, b) => a.dateBegining - b.dateBegining);

    if (this._events.length === 0) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._boardComponent, RenderPosition.BEFOREEND);

    const tripDaysElement = this._container.querySelector(`.trip-days`);

    renderEvents(this._events, tripDaysElement, this._onDataChange);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedEvents = [];

      switch (sortType) {
        case SortType.TIME:
          sortedEvents = this._events.slice().sort((a, b) => (b.dateEnding.getTime() - b.dateBegining.getTime()) - (a.dateEnding.getTime() - a.dateBegining.getTime()));
          break;
        case SortType.PRICE:
          sortedEvents = this._events.slice().sort((a, b) => b.price - a.price);
          break;
        case SortType.DEFAULT:
          sortedEvents = this._events.slice();
          break;
      }

      tripDaysElement.innerHTML = ``;
      if (sortType === SortType.DEFAULT) {
        renderEvents(sortedEvents, tripDaysElement, this._onDataChange);
      } else {
        renderSortedEvents(sortedEvents, tripDaysElement, this._onDataChange);
      }
    });
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

    pointController.render(this._events[index]);
  }
}
