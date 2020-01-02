/* eslint-disable require-jsdoc */
import System from '../system.mjs';
import World from '../../world.mjs';

const SYSTEM_TYPE = 'Collision';
const COMPONENT_TYPE = 'Collider';

class CollisionSystem extends System {
  constructor() {
    super(SYSTEM_TYPE, COMPONENT_TYPE);

    const checkCollision = (entityA, entityB) => {
      let collisionOccurred = undefined;
      if (entityA !== undefined && entityB !== undefined) {
        physicsA = entityA.getComponentByType('Physics');
        colliderSizeA = entityA.getComponentByType('Colldier').BoxSizeFactor;
        physicsB = entityB.getComponentByType('Physics');
        colliderSizeB = entityB.getComponentByType('Colldier').BoxSizeFactor;

        if (physicsA && physicsB && colliderSizeA && colliderSizeB ) {
          collisionOccurred = (
            physicsA.Position.x < physicsB.Position.x + physicsB.Size.x &&
            physicsA.Position.x + physicsA.Size.x > physicsB.Position.x &&
            physicsA.Position.y < physicsB.Position.y + physicsB.Size.y &&
            physicsA.Position.y + physicsA.Size.y > physicsB.Position.y
          );
        }
      }
      return collisionOccurred;
    };

    this.checkAndHandleWorldCollision = (entity) => {
      if (entity !== undefined) {
        const physics = entity.getComponentByType('Physics');
        if (physics !== undefined) {
          const xNext = physics.Position.x + physics.Size.x/2;
          const yNext = physics.Position.y + physics.Size.y;

          if (World.isSolidTileAtPosition(
              Math.floor(xNext),
              Math.floor(yNext))
          ) {
            physics.Velocity.y = 0;
          }
        }
      }
    };
  }

  registerEntity(entity) {
    return super.registerEntity(entity);
  }

  unregisterEntity(entity) {
    return super.unRegisterEntity(entity);
  }

  onUpdate(dt) {
    for (const entity of this._registeredEntities.values()) {
      this.checkAndHandleWorldCollision(entity);
    }
  }

  onRender(ctx) {
    // TODO disable debug code
    ctx.save();
    ctx.globalAlpha = 0.4;
    for (const entity of this._registeredEntities.values()) {
      const physics = entity.getComponentByType('Physics');
      if (physics === undefined ) {
        continue;
      }
      ctx.fillRect(
          Math.floor(physics.Position.x),
          Math.floor(physics.Position.y),
          physics.Size.x/2,
          physics.Size.y,
      );
    }
    ctx.restore();
  }

  onShutdown() {
    super.onShutdown();
  }
};

const createCollisionSystem = () => {
  let system = new CollisionSystem();
  system = Object.freeze(system);
  return system;
};

export default createCollisionSystem;