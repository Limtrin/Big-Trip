import {eventTypeTransfer, eventTypeActivity, cityList} from '../constants.js';

const eventType = eventTypeActivity.concat(eventTypeTransfer);

const descriptionParts = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const offersList = [
  {
    name: `luggage`,
    type: `flight`,
    price: 10,
    desc: `Add luggage`
  },
  {
    name: `comfort`,
    type: `flight`,
    price: 150,
    desc: `Switch to comfort class`
  },
  {
    name: `meal`,
    type: `flight`,
    price: 2,
    desc: `Add Meal`
  },
  {
    name: `seats`,
    type: `flight`,
    price: 9,
    desc: `Choose seats`
  }
];

const getRandomItemFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const generatePictures = (count) => {
  return new Array(count)
    .fill(``)
    .map(() => {
      return `http://picsum.photos/300/150?r=${Math.random()}`;
    });
};

const generateDescription = (description) => {
  return description
    .filter(() => Math.random() > 0.5)
    .slice(0, 3)
    .join(` `);
};

const getRandomDate = () => {
  const targetDate = new Date(2019, 10, 19, Math.floor(Math.random() * 23), Math.floor(Math.random() * 60));

  return targetDate;
};

const getRandomOffers = (offers) => {
  return offers
    .filter(() => Math.random() > 0.5)
    .slice(0, 2);
};

const generateEvent = () => {

  const dateBegining = getRandomDate();
  const dateEnding = new Date(Date.parse(dateBegining) + 60 * 1000 * Math.floor(Math.random() * 90));

  return {
    type: getRandomItemFromArray(eventType),
    city: getRandomItemFromArray(cityList),
    photos: generatePictures(Math.floor(Math.random() * 5)),
    description: generateDescription(descriptionParts),
    dateBegining,
    dateEnding,
    price: Math.floor(Math.random() * 100),
    offers: getRandomOffers(offersList)
  };
};

const generateEventList = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {generateEvent, generateEventList};
