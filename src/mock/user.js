export const getUserLevel = (films) => {
  return films.reduce((acc, film) => {
    if (film.isInHistory) {
      acc++;
    }
    return acc;
  }, 0);
};
