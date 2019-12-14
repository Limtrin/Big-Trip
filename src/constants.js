export const eventTypeTransfer = [
  `bus`,
  `drive`,
  `flight`,
  `ship`,
  `taxi`,
  `train`,
  `transport`
];

export const eventTypeActivity = [
  `check-in`,
  `restaurant`,
  `sightseeing`
];

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

const generateDescription = (description) => {
  return description
    .filter(() => Math.random() > 0.5)
    .slice(0, 3)
    .join(` `);
};

const generatePictures = (count) => {
  return new Array(count)
    .fill(``)
    .map(() => {
      return `http://picsum.photos/300/150?r=${Math.random()}`;
    });
};

export const cityList = [
  {
    name: `Amsterdam`,
    description: generateDescription(descriptionParts),
    pictures: generatePictures(5)
  },
  {
    name: `Geneva`,
    description: generateDescription(descriptionParts),
    pictures: generatePictures(5)
  },
  {
    name: `Chamonix`,
    description: generateDescription(descriptionParts),
    pictures: generatePictures(5)
  },
  {
    name: `Saint Petersburg`,
    description: generateDescription(descriptionParts),
    pictures: generatePictures(5)
  }
];

export const offersList = [
  {
    name: `luggage`,
    type: `flight`,
    price: 10,
    desc: `Add luggage`,
    isChosen: false
  },
  {
    name: `comfort`,
    type: `flight`,
    price: 150,
    desc: `Switch to comfort class`,
    isChosen: false
  },
  {
    name: `meal`,
    type: `flight`,
    price: 2,
    desc: `Add Meal`,
    isChosen: false
  },
  {
    name: `seats`,
    type: `flight`,
    price: 9,
    desc: `Choose seats`,
    isChosen: false
  },
  {
    name: `seats`,
    type: `bus`,
    price: 5,
    desc: `Comfort seats`,
    isChosen: false
  }
];
