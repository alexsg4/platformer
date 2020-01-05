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
      position.x += Math.floor(velocity.x);
      position.y += Math.floor(velocity.y);
      velocity.x = 0;
      velocity.y = 0;
    }
  }

  onRender(ctx) {
    if (window.GameParams.DebugOverlay) {
      ctx.save();
      ctx.strokeStyle = 'green';
      for (const entity of this._registeredEntities.values()) {
        const physics = entity.getComponentByType(COMPONENT_TYPE);
        const position = physics.Position;
        const size = physics.Size;
        ctx.beginPath();
        ctx.moveTo(position.x + size.x/2, position.y);
        ctx.lineTo(position.x + size.x/2, position.y + size.y);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
};

const createMovementSystem = () => {
  const system = new MovementSystem();
  return system;
};

export default createMovementSystem;
