const NOVICE = 10;
const FAN = 20;

const getUserTitle = (number) => {
  if (number > FAN) {
    return `Movie Buff`;
  }
  if (number > NOVICE) {
    return `Fun`;
  }
  if (number > 0) {
    return `Novice`;
  }
  return ``;
};

export const getUserProfileTemplate = (number) => {
  const title = getUserTitle(number);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${title}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};
