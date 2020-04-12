const getFiltersMarkup = (filters) => {
  return filters
    .map((filter) => {
      const {title, count} = filter;
      return (
        `<a href="#${title}" class="main-navigation__item main-navigation__item--">${title}
          <span class="main-navigation__item-count">${count}</span>
        </a>`
      );
    })
    .join(`\n`);
};

export const getMainNavTemplate = (filters) => {
  const noFilterTitle = filters[0].title;
  const filtersMarkup = getFiltersMarkup(filters.slice(1));

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#${noFilterTitle}" class="main-navigation__item main-navigation__item--active">${noFilterTitle} movies</a>
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};
