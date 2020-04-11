const DESCRIPTION_MIN_SENTENCES = 1;
const DESCRIPTION_MAX_SENTENCES = 5;
const MAX_COMMENTS_AMOUNT = 5;
const MIN_ACTORS = 2;
const MAX_ACTORS = 5;
const MAX_WRITERS = 3;
const MIN_YEAR = 1930;
const MAX_YEAR = 2020;
const MIN_LENGTH = 60;
const MAX_LENGTH = 180;
const MIN_AGE = 1;
const MAX_AGE = 7;
const HOUR = 60;
const FILM_NAMES = [
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`,
  `The Great Flamarion`,
  `Made for Each Other`
];

const FilmToPosterFile = {
  [`Made for Each Other`]: `made-for-each-other.png`,
  [`Popeye the Sailor Meets Sindbad the Sailor`]: `popeye-meets-sinbad.png`,
};

const COUNTRIES = [
  `USA`,
  `France`,
  `Italy`,
  `Greate Britain`,
  `India`
];

const GENRES = [
  `action`,
  `adventure`,
  `comedy`,
  `crime`,
  `drama`,
  `historical`,
  `horror`,
  `musical`,
  `sience fiction`,
  `thriller`,
  `war`,
  `western`
];

const DIRECTORS = [
  `Martin Scorsese`,
  `Steven Spielberg`,
  `George Lucas`,
  `James Cameron`,
  `Quentin Tarantino`,
  `Christopher Nolan`,
  `Alfred Hitchcock`,
  `Federico Fellini`,
  `Ingmar Bergman`,
  `Andrey Tarkovsky`
];

const WRITERS = [
  `Billy Wilder`,
  `Francis Ford Coppola`,
  `Ingmar Bergman`,
  `Quentin Tarantino`,
  `Ethan and Joel Cohen`,
  `David Lynch`,
  `Brian Cogman`,
  `David Benioff, D. B. Weiss`,
  `George Martin`,
  `Vanessa Taylor`,
  `Alik Sakharov`,
  `Michelle McLaren`,
  `Dave Hill`,
  `Jane Espenson`
];

const DESCRIPTION_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const ACTORS = [
  `Tom Hanks`,
  `John Malkovich`,
  `Johnny Depp`,
  `Julia Roberts`,
  `Jack Nicholson`,
  `Sigourney Weaver`,
  `Anthony Hopkins`,
  `Natalie Portman`,
  `Jeremy Irons`,
  `Angelina Jolie`,
  `Brad Pitt`,
  `Leonardo Dicaprio`,
  `Robert De Niro`,
  `Will Smith`,
  `Colin Farrell`,
  `Tom Hardy`,
  `Hugh Grant`,
  `Jennifer Lawrence`
];

const COMMENT_TEXTS = [
  `It's a simple, but at the same time exciting movie`,
  `After watching the movie, you suddenly start to believe in magic`,
  `This is a new symbiosis of a blockbuster with post-Apocalypse`,
  `Everything is fantastic and believable`,
  `In a week you will not remember that you've seen the movie`,
  `I liked the beautiful outfits of female characters`,
  `Most modern viewers may find this film boring and corny`,
  `The soundtrack is nothing but pop music`,
  `The actors are either half-assing or are too hammy`,
  `So cynical and indecent, I wouldn't ever rate it positively`,
  `This is a disgrace, gentlemen`,
  `Dumb and dumber, the threequel`,
  `When's the sequel coming out? This is a must watch`,
  `The movie is touching and fun, makes you live through all these feelings and reflect on them `
];

const EMOTIONS = [`smile`, `sleeping`, `puke`, `angry`];

const getRandomInteger = (min, max) => Math.round(Math.random() * (max - min) + min);
const getRandomBoolean = () => Math.random() < 0.5;

const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomSubList = (items, value) => {
  let subList = [];
  if (value) {
    subList = items.slice();
    for (let i = 0; i < items.length - value; i++) {
      subList.splice(getRandomInteger(0, subList.length - 1), 1);
    }
  }
  return subList;
};

const getRandomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - getRandomInteger(0, 20));
  return date;
};

const getRandomDuration = () => {
  const duration = getRandomInteger(MIN_LENGTH, MAX_LENGTH);
  const hours = Math.trunc(duration / HOUR);
  const minutes = duration % HOUR;
  return `${hours}h ${minutes}m`;
};

const getFilmPoster = (name) => {
  const path = name.split(` `).map((word) => word.toLowerCase()).join(`-`);
  return `${path}.jpg`;
};

const sentences = DESCRIPTION_TEXT.split(`. `).map((item) => item.endsWith(`.`) ? item : `${item}.`);

const getFilmDescription = () => {
  const descriptionLength = getRandomInteger(DESCRIPTION_MIN_SENTENCES, DESCRIPTION_MAX_SENTENCES);
  const descriptions = getRandomSubList(sentences, descriptionLength);
  return descriptions.join(` `);
};

const getFilmComments = () => {
  const amount = getRandomInteger(0, MAX_COMMENTS_AMOUNT);
  const comments = new Array(amount);
  return comments
    .fill(``)
    .map(() => {
      return {
        emotion: getRandomItem(EMOTIONS),
        date: getRandomDate(),
        text: getRandomItem(COMMENT_TEXTS),
        author: getRandomItem(ACTORS)
      };
    });
};

const createFilm = () => {
  const title = getRandomItem(FILM_NAMES);
  return {
    title,
    poster: FilmToPosterFile[title] || getFilmPoster(title),
    director: getRandomItem(DIRECTORS),
    writers: getRandomSubList(WRITERS, getRandomInteger(1, MAX_WRITERS)).join(`, `),
    actors: getRandomSubList(ACTORS, getRandomInteger(MIN_ACTORS, MAX_ACTORS)).join(`, `),
    year: getRandomInteger(MIN_YEAR, MAX_YEAR),
    duration: getRandomDuration(),
    country: getRandomItem(COUNTRIES),
    genre: getRandomItem(GENRES),
    description: getFilmDescription(),
    comments: getFilmComments(),
    rating: getRandomInteger(0, 100) / 10,
    age: getRandomInteger(MIN_AGE, MAX_AGE) * 3,
    isWatched: getRandomBoolean(),
    isFavorite: getRandomBoolean(),
  };
};

export const generateFilms = (amount) => {
  return new Array(amount)
    .fill(``)
    .map(createFilm);
};

