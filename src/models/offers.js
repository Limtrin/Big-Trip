export default class Offer {
  constructor() {
    this._offers = null;
  }

  getOffers() {
    return this._offers;
  }

  setOffers(offersList) {
    this._offers = offersList.map((offer) => {
      const offers = offer.offers.map((offerItem) => {
        return {
          title: offerItem.title,
          price: offerItem.price,
          isChosen: false
        };
      });
      return {
        type: offer.type,
        offers
      };
    });
  }
}
