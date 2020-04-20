const getUserLevel = (films) => {
  return films.reduce((acc, film) => {
    if (film.isInHistory) {
      acc++;
    }
    return acc;
  }, 0);
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
export {getUserLevel, getExtraFilms};
