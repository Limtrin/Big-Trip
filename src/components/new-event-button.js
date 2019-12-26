import AbstractComponent from './abstract-class.js';

const createEditButtonTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
  );
};

export default class NewButton extends AbstractComponent {
  getTemplate() {
    return createEditButtonTemplate();
  }

  setClickNewEventButtonChangeHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
