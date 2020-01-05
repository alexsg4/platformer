/* eslint-disable require-jsdoc */
import System from '../system.mjs';
import {isNullOrUndefined} from '../../utils/misc.mjs';

const SYSTEM_TYPE = 'Health';
const COMPONENT_TYPE = 'Health';

class HealthSystem extends System {
  constructor(unspawnFn) {
    super(SYSTEM_TYPE, COMPONENT_TYPE);
    this._unspawnCallback = typeof unspawnFn === 'function' ? unspawnFn : null;
  }

  registerEntity(entity) {
    return super.registerEntity(entity);
  }

  unRegisterEntity(entity) {
    return super.unRegisterEntity(entity);
  }

  onInit(unspawnFn) {
    super.onInit();
  }

  onUpdate(dt) {
    for (const entity of this._registeredEntities.values()) {
      const health = entity.getComponentByType(COMPONENT_TYPE);
      if (health.HP <= 0) {
        if (entity.getID() === this._playerID) {
          // TODO enable once game flow is finalised
          this._needGameStop = true;
          return;
        } else if (this._unspawnCallback) {
          this._unspawnCallback(entity);
        }
      }
    }
  }

  onShutdown() {
    super.onShutdown();
    this._unspawnCallback = null;
  }
};

const createHealthSystem = (unspawnFn) => {
  const system = new HealthSystem(unspawnFn);
  return system;
};

export default createHealthSystem;
