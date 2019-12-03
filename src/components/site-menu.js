const createMenuMarkup = (items) => {
  return items
    .map((item) => {
      return (
        `<a class="trip-tabs__btn" href="#">${item}</a>`
      );
    })
    .join(`\n`);
};

export const createSiteMenuTemplate = (menuItems) => {
  const menuMarkup = createMenuMarkup(menuItems);

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${menuMarkup}
    </nav>`
  );
};
