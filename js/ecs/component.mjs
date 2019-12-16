/* eslint-disable require-jsdoc */
import Entity from './entity.mjs';
import Unique from './Unique.mjs';
import {isNullOrUndefined} from '../utils/misc.mjs';

class Component extends Unique {
  constructor() {
    super();
    this.parent = null;
  }

  onAttach(parent) {
    if (isNullOrUndefined(parent)) {
      console.error('Trying to attach component to null parent!');
      return;
    }

    if (!parent instanceof Entity) {
      console.error('Trying to attach component to non-entity!');
      return;
    }

    this.parent = parent;
  }

  onCollisionStart(...args) {

  }

  onCollisionOngoing(...args) {

  }

  onCollisionEnd(...args) {

  }

  onUpdate(dt) {

  }

  onRender(ctx) {

  }

  getComponentType() {
    return 'GenericComponent';
  }
};

export default Component;
