export default class Event {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.city = {
      name: data[`destination`][`name`],
      description: data[`destination`][`description`],
      pictures: data[`destination`][`pictures`]
    };
    this.dateBegining = data[`date_from`] ? new Date(data[`date_from`]) : null;
    this.dateEnding = data[`date_to`] ? new Date(data[`date_to`]) : null;
    this.price = data[`base_price`];
    this.offers = data[`offers`] || ``;
    this.isFavorite = data[`is_favorite`];
    this.isNew = false;
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type,
      'destination': this.city,
      'date_from': this.dateBegining ? this.dateBegining.toISOString() : null,
      'date_to': this.dateEnding ? this.dateEnding.toISOString() : null,
      'base_price': this.price,
      'offers': this.offers,
      'is_favorite': this.isFavorite
    };
  }

  static parseEvent(data) {
    return new Event(data);
  }

  static parseEvents(data) {
    return data.map(Event.parseEvent);
  }

  static clone(data) {
    return new Event(data.toRAW());
  }
}
