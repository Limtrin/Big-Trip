import AbstractComponent from './abstract-class.js';

export default class Loading extends AbstractComponent {
  getTemplate() {
    return `<p class="trip-events__msg">Loading...</p>`;
  }
}
