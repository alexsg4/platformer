/* eslint-disable require-jsdoc */
import generateUID from '../utils/counter.mjs';
import createComponent from './component.mjs';
import {isNullOrUndefined} from '../utils/misc.mjs';

class Entity {
  constructor(archetype, componentData) {
    const _id = generateUID();
    const _archetype = archetype;
    const _components = new Map();

    this.getID = () => {
      return _id;
    };

    this.getArchetype = () => {
      return _archetype;
    };

    this.attachComponent = (component) => {
      if (!isNullOrUndefined(component)) {
        _components.set(component.getID(), component);
        component.onAttach(_id);
      }
    };

    this.getComponentByType = (type) => {
      let compData = undefined;
      for (const component of _components.values()) {
        if (component.getType() === type) {
          compData = component.getConfig();
          break;
        }
      }
      return compData;
    };

    if (!isNullOrUndefined(archetype) && !isNullOrUndefined(componentData)) {
      for (const componentConfig of Object.entries(componentData)) {
        const componentToAdd = createComponent(componentConfig);
        this.attachComponent(componentToAdd);
      }
    }
    return this;
  }
};

// make Entity class 'final'
const createEntity = (archetype, params) => {
  let entity = new Entity(archetype, params);
  entity = Object.freeze(entity);
  return entity;
};

export default createEntity;
