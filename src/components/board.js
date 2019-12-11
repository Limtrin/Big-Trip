import AbstractComponent from './abstract-class.js';

const createBoardTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class Board extends AbstractComponent {
  getTemplate() {
    return createBoardTemplate();
  }
}
