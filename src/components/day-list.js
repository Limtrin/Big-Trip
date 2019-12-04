
export const createTripDayListTemplate = (date) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">1</span>
        <time class="day__date" datetime="${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}">${date.toLocaleDateString(`en-US`, {month: `short`})} ${date.getDay()}</time>
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};
