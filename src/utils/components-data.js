import {SortType} from "../components/sort.js";

const getRandomInteger = (min, max) => Math.round(Math.random() * (max - min) + min);

const getRandomItems = (items, amount) => {
  const subList = [];
  const initialItems = items.slice();
  if (amount) {
    for (let i = 0; i < amount; i++) {
      const index = getRandomInteger(0, initialItems.length - 1);
      subList.push(initialItems[index]);
      initialItems.splice(index, 1);
    }
  }
  return subList;
};

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

    default:
      sortedFilms = getTopRatedFilms(films);
      break;
  }
  return sortedFilms;
};

const getMostCommentedFilms = (films, amount) => {
  let checkedFilms = [];
  if (films.some((film) => film.comments.length > 0)) {
    const sortedFilms = films
    .slice()
    .sort((left, right) => {
      return right.comments.length - left.comments.length;
    });
    // Находим фильмы с одинаковым количеством комментариев
    const sameCommentsAmountFilms = [];
    const maxCommentsAmount = sortedFilms[0].comments.length;
    for (let film of sortedFilms) {
      if (film.comments.length === maxCommentsAmount) {
        sameCommentsAmountFilms.push(film);
      } else {
        break;
      }
    }

    if (sameCommentsAmountFilms.length > 2) {
      checkedFilms = getRandomItems(sameCommentsAmountFilms, amount);
    } else {
      checkedFilms = sortedFilms.slice(0, amount);
    }
  }
  return checkedFilms;
};

const getTopRatedFilms = (films, amount) => {
  if (films.some((film) => film.rating > 0)) {
    return films
    .slice().sort((left, right) => {
      return right.rating - left.rating;
    })
    .slice(0, amount);
  }
  return [];
};

export {getUserLevel, getMostCommentedFilms, getTopRatedFilms, getSortedFilms};
