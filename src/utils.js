const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());
  return ` ${year}/${month}/${day} ${hours}:${minutes}`;
};

const createElement = (template) => {
  const divElement = document.createElement(`div`);
  divElement.innerHTML = template;
  return divElement.firstChild;
};

const render = (container, element, place = RenderPosition.BEFOREEND) => {
  if (place === RenderPosition.AFTERBEGIN) {
    container.prepend(element);
    return;
  }
  container.append(element);
};

export {formatDate, createElement, render, RenderPosition};
