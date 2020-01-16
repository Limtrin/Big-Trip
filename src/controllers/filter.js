import {filterItems} from '../constants.js';
import FilterComponent from '../components/filter.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import {getEventsByFilter} from '../utils/filter.js';

export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._activeFilterType = filterItems.EVERITHING;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._rerenderFiltersStatus = this._rerenderFiltersStatus.bind(this);

    this._eventsModel.setDataChangeHandler(this._rerenderFiltersStatus);
  }

  render(events) {
    const container = this._container;
    const filters = Object.values(filterItems).map((filterType) => {
      return {
        name: filterType,
        checked: filterType === this._activeFilterType,
        disabled: getEventsByFilter(events, filterType).length === 0
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.AFTEREND);
    }
  }

  _onFilterChange(filterType) {
    this._eventsModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this.render(this._eventsModel.getEventsAll());
  }

  _rerenderFiltersStatus(events = this._eventsModel.getEventsAll()) {
    this.render(events);
  }

  hide() {
    this._filterComponent.hide();
  }

  show() {
    this._filterComponent.show();
  }
}
