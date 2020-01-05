/* eslint-disable require-jsdoc */
import System from '../system.mjs';

// TODO load constants from json
const GRAVITY = 2;
const FRICTION = 0.25;
const SYSTEM_TYPE = 'Physics';
const COMPONENT_TYPE = 'Physics';

class PhysicsSystem extends System {
  constructor() {
    super(SYSTEM_TYPE, COMPONENT_TYPE);
  }

  onUpdate(dt) {
    for (const entity of this._registeredEntities.values()) {
      const componentToUpdate = entity.getComponentByType(SYSTEM_TYPE);
      const velocity = componentToUpdate['Velocity'];
      velocity.x *= (1 - FRICTION);
      velocity.y += GRAVITY;
      velocity.y *= (1 - FRICTION);
    }
  }
};

const createPhysicsSystem = () => {
  const physicsSystem = new PhysicsSystem();
  return physicsSystem;
};

export default createPhysicsSystem;
