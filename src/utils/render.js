const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

const createElement = (template) => {
  const divElement = document.createElement(`div`);
  divElement.innerHTML = template;
  return divElement.firstChild;
};

const render = (container, component, place = RenderPosition.BEFOREEND) => {
  if (place === RenderPosition.AFTERBEGIN) {
    container.prepend(component.getElement());
    return;
  }
  if (place === RenderPosition.BEFOREEND) {
    container.append(component.getElement());
    return;
  }
};

const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

const replace = (newComponent, oldComponent) => {
  const oldElement = oldComponent.getElement();
  const parentElement = oldElement.parentElement;
  const newElement = newComponent.getElement();
  if (oldElement && parentElement) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

export {RenderPosition, createElement, render, remove, replace};
