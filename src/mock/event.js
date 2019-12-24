import {eventTypeTransfer, eventTypeActivity, cityList, offersList} from '../constants.js';

const eventType = eventTypeActivity.concat(eventTypeTransfer);


const getRandomItemFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * Math.floor(Math.random() * 7);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const generateEvent = () => {

  const dateBegining = getRandomDate();
  const dateEnding = new Date(Date.parse(dateBegining) + 60 * 1000 * Math.floor(Math.random() * 90));
  const typeEvent = getRandomItemFromArray(eventType);
  const typeOffers = offersList.slice().map((it) => {
    return Object.assign({}, it);
  }).filter((it) => it.type === typeEvent);
  typeOffers.forEach((it) => {
    it.isChosen = Math.random() > 0.5;
  });


  return {
    id: String(new Date() + Math.random()),
    type: typeEvent,
    city: getRandomItemFromArray(cityList),
    dateBegining,
    dateEnding,
    price: Math.floor(Math.random() * 100),
    offers: typeOffers,
    isFavorite: Math.random() > 0.5,
    isNew: false
  };
};

const generateEventList = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {generateEvent, generateEventList};
