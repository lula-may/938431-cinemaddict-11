import {getRandomInteger, getRandomItem, ACTORS} from "./film.js";
import {EMOTIONS} from "../const.js";

const MAX_COMMENTS_AMOUNT = 5;

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

const getRandomCommentDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - getRandomInteger(0, 10));
  return date;
};

let comments = [];

export const getFilmComments = () => {
  const amount = getRandomInteger(0, MAX_COMMENTS_AMOUNT);
  const newComments = new Array(amount);
  return newComments
    .fill(``)
    .map(() => {
      return {
        id: String(Math.round(new Date() * Math.random())),
        emotion: getRandomItem(EMOTIONS),
        date: getRandomCommentDate(),
        text: getRandomItem(COMMENT_TEXTS),
        author: getRandomItem(ACTORS)
      };
    });

};

export const getFilmCommentsIds = () => {
  const newComments = getFilmComments();
  comments = [].concat(comments, newComments);
  return newComments.map((item) => item.id);
};


export const getComments = () => {
  return comments;
};
