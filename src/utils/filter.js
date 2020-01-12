import {filterItems} from '../constants.js';

export const getEventsByFilter = (events, filterType) => {
  switch (filterType) {
    case filterItems.EVERITHING:
      return events;
    case filterItems.PAST:
      return events.filter((it) => it.dateEnding < new Date());
    case filterItems.FUTURE:
      return events.filter((it) => it.dateBegining > new Date());
  }

  return events;
};
