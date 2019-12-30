/* eslint-disable require-jsdoc */
import {isNullOrUndefined} from '../utils/misc.mjs';

class System {
  constructor(systemType, compType) {
    this._type = typeof systemType === 'string' ? systemType : undefined;
    this._componentType = typeof compType === 'string' ? compType : undefined;
    this._registeredEntities = new Map();
  }

  getType() {
    return this._type;
  }

  registerEntity(entity) {
    if (isNullOrUndefined(entity) ||
      isNullOrUndefined(entity.getComponentByType(this._componentType))) {
      console.warn('Attempting to register invalid entity.');
      return false;
    }
    if (!isNullOrUndefined(this._registeredEntities.get(entity.getID()))) {
      console.warn('Entity already registered.!');
      return false;
    }
    this._registeredEntities.set(entity.getID(), entity);
    return true;
  }

  unRegisterEntity(entity) {
    if (isNullOrUndefined(entity)) {
      console.warn('Attempting to unregister invalid entity.');
      return false;
    }
    this._registeredEntities.delete(entity.getID());
    return true;
  }

  onInit() {
    return;
  }

  onUpdate(dt) {
    return;
  }

  onRender(ctx) {
    return;
  }

  onShutdown() {
    this._registeredEntities.clear();
  }
};

export default System;
