/* eslint-disable require-jsdoc */
import System from '../system.mjs';
import Vector2D from '../../utils/math/vector2d.mjs';

const SYSTEM_TYPE = 'Collision';
const COMPONENT_TYPE = 'Collider';

// TODO remove magic numbers
const VSIZE_X = 100;
const VSIZE_Y = 100;

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

    this.checkAndHandleOOB = (entity) => {
      if (entity !== undefined) {
        const physics = entity.getComponentByType('Physics');
        if (physics !== undefined) {
          let velX = physics.Velocity.x;
          let velY = physics.Velocity.y;
          const nextPosX = physics.Position.x + physics.Size.x * 2.5 + velX;
          const nextPosY = physics.Position.y + physics.Size.y * 2.5 + velY;

          if (nextPosX > VSIZE_X || nextPosX < 0) {
            velX = 0;
          }
          if (nextPosY > VSIZE_Y || nextPosY < 0) {
            velY = 0;
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
      this.checkAndHandleOOB(entity);
    }
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