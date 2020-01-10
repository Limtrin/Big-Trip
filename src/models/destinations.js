export default class Destination {
  constructor() {
    this._destinations = null;
  }

  getDestinations() {
    return this._destinations;
  }

  setDestinations(destinations) {
    this._destinations = destinations.map((destination) => {
      return {
        name: destination.name,
        description: destination.description,
        pictures: destination.pictures
      };
    });
  }
}
