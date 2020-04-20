import {SortType} from "../components/sort.js";

const getUserLevel = (films) => {
  return films.reduce((acc, film) => {
    if (film.isInHistory) {
      acc++;
    }
    return acc;
  }, 0);
};

const getSortedFilms = (films, sortType) => {
  let sortedFilms = [];
  switch (sortType) {
    case SortType.DEFAULT:
      sortedFilms = films.slice();
      break;

    case SortType.BY_DATE:
      sortedFilms = films
      .slice()
      .sort((left, right) => right.date - left.date);
      break;

    case SortType.BY_RATING:
      sortedFilms = getTopRatedFilms(films);
      break;
  }
  return sortedFilms;
};

const getMostCommentedFilms = (films, amount) => {
  return films
  .slice()
  .sort((left, right) => {
    return right.comments.length - left.comments.length;
  })
  .slice(0, amount);
};

const getTopRatedFilms = (films, amount) => {
  return films
    .slice().sort((left, right) => {
      return right.rating - left.rating;
    })
    .slice(0, amount);
};

const getExtraFilms = (films, amount) => {
  const extraFilms = [];
  extraFilms.push(getTopRatedFilms(films, amount));
  extraFilms.push(getMostCommentedFilms(films, amount));
  return extraFilms;
};
export {getUserLevel, getExtraFilms, getSortedFilms};
