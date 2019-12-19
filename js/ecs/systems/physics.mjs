/* eslint-disable require-jsdoc */

import System from '../system.mjs';

// TODO load constants from json
const GRAVITY = 1;
const FRICTION = 0;
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
      velocity.x *= (1- FRICTION) ;
      //velocity.y += GRAVITY*FRICTION;

      const position = componentToUpdate['Position'];
      position.x += velocity.x;
      position.y += velocity.y;
      velocity.x = 0;
      velocity.y = 0;
    }
  }
};

const createPhysicsSystem = () => {
  let physicsSystem = new PhysicsSystem();
  physicsSystem = Object.freeze(physicsSystem);
  return physicsSystem;
};

export default createPhysicsSystem;

