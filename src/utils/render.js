const createElement = (template) => {
  const divElement = document.createElement(`div`);
  divElement.innerHTML = template;
  return divElement.firstChild;
};

const render = (container, component, place = `beforeend`) => {
  if (place === `afterbegin`) {
    container.prepend(component.getElement());
    return;
  }
  if (place === `beforeend`) {
    container.append(component.getElement());
    return;
  }
};

const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export {createElement, render, remove};
