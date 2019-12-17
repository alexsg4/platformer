/* eslint-disable require-jsdoc */
import generateUID from '../utils/counter.mjs';
import createComponent from './component.mjs';
import {isNullOrUndefined} from '../utils/misc.mjs';

class Entity {
  constructor(archetype, componentData) {
    this.id = generateUID();
    this.archetype = archetype;
    this.components = new Map();
    if (!isNullOrUndefined(archetype) && !isNullOrUndefined(componentData)) {
      for (const componentConfig of Object.entries(componentData)) {
        const componentToAdd = createComponent(componentConfig);
        this.attachComponent(componentToAdd);
      }
    }

    return this;
  }

  attachComponent(component) {
    if (!isNullOrUndefined(component)) {
      this.components.set(component.id, component);
      component.onAttach(this.id);
    }
  }
};

const createEntity = (archetype, params) => {
  const entity = new Entity(archetype, params);
  return entity;
};

export default createEntity;
