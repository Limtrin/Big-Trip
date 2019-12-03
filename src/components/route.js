export const createRouteTemplate = (events) => {
  let cityArray = [];
  let eventsDate = [];
  let total = 0;

  events.map((event) => {
    const {city, dateBegining, price, offers} = event;
    cityArray.push(city);
    eventsDate.push(dateBegining);
    total += price;
    offers.map((offer) => {
      total += offer.price;
    });
  });

  return (
    `<div class="trip-info__main">
        <h1 class="trip-info__title">${cityArray[0]} &mdash; ... &mdash; ${cityArray[cityArray.length - 1]}</h1>

        <p class="trip-info__dates">${eventsDate[0].toLocaleDateString(`en-US`, {month: `short`})} ${eventsDate[0].getDay()}&nbsp;&mdash;&nbsp;${eventsDate[eventsDate.length - 1].getDay()}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
    </p>`
  );
};
