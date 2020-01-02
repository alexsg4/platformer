/* eslint-disable require-jsdoc */

import System from '../system.mjs';

// TODO load constants from json
const SYSTEM_TYPE = 'Movement';
const COMPONENT_TYPE = 'Physics';

class MovementSystem extends System {
  constructor() {
    super(SYSTEM_TYPE, COMPONENT_TYPE);
  }

  onUpdate(dt) {
    for (const entity of this._registeredEntities.values()) {
      const physics = entity.getComponentByType(COMPONENT_TYPE);

      const position = physics.Position;
      const velocity = physics.Velocity;
      position.x += Math.floor(velocity.x) * dt;
      position.y += Math.floor(velocity.y) * dt;
      velocity.x = 0;
      velocity.y = 0;
    }
  }
};

const createMovementSystem = () => {
  let system = new MovementSystem();
  system = Object.freeze(system);
  return system;
};

export default createMovementSystem;

