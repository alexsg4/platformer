/* eslint-disable require-jsdoc */
import System from '../system.mjs';
import World from '../../world.mjs';
import {isNullOrUndefined} from '../../utils/misc.mjs';

const SYSTEM_TYPE = 'Collision';
const COMPONENT_TYPE = 'Collider';

class CollisionSystem extends System {
  constructor() {
    super(SYSTEM_TYPE, COMPONENT_TYPE);

    const checkCollisionEntity = (entityA, entityB) => {
      let collisionOccurred = undefined;
      if (!isNullOrUndefined(entityA) && !isNullOrUndefined(entityB)) {
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
      if (isNullOrUndefined(entity)) {
        console.error('Entity null or undefined!');
        return;
      }
      const physics = entity.getComponentByType('Physics');
      if (isNullOrUndefined(physics)) {
        console.error('Entity physics component null or undefined!');
        return;
      }

      const yTop = Math.floor(physics.Position.y);
      const yBottom = Math.floor(physics.Position.y + physics.Size.y) + 1;

      const xRight = Math.floor(physics.Position.x + physics.Size.x) + 1;
      const xLeft = Math.floor(physics.Position.x);

      const tileSize = World.getTileSize();
      const worldSize = World.getSize();

      const pushbackForce = 2;

      // TODO tweak oob limits
      // Bottom exit
      if (yBottom >= worldSize.row * tileSize) {
        physics.Position.y -= pushbackForce;
        physics.Velocity.y = 0;
      }

      // Top exit
      if (yTop < 0) {
        physics.Position.y += pushbackForce;
        physics.Velocity.y = 0;
      }

      // Left side exit
      if (xLeft < 0) {
        physics.Position.x += pushbackForce;
        physics.Velocity.x = 0;
      }

      // Right side exit
      if (xRight > worldSize.col * tileSize) {
        physics.Position.x -= pushbackForce;
        physics.Velocity.x = 0;
      }
    };

    this.checkAndHandleWorldCollision = (entity) => {
      if (isNullOrUndefined(entity)) {
        console.error('Entity null or undefined!');
        return;
      }
      const physics = entity.getComponentByType('Physics');
      if (isNullOrUndefined(physics)) {
        console.error('Entity physics component null or undefined!');
        return;
      }

      const xCenter = Math.floor(physics.Position.x + physics.Size.x/2);
      const yCenter = Math.floor(physics.Position.y + physics.Size.y/2);

      const yTop = Math.floor(physics.Position.y);
      const yBottom = Math.floor(physics.Position.y + physics.Size.y) + 1;

      const xRight = Math.floor(physics.Position.x + physics.Size.x) + 1;
      const xLeft = Math.floor(physics.Position.x);

      const tileSize = World.getTileSize();

      // Bottom collision
      if (World.isSolidTileAtPosition(xCenter, yBottom)) {
        const row = Math.floor(yBottom/tileSize)*tileSize;
        physics.Velocity.y -= Math.abs(yBottom-row);
      }

      // Top collision
      if (World.isSolidTileAtPosition(xCenter, yTop)) {
        const row = Math.floor(yTop/tileSize)*tileSize;
        physics.Velocity.y += Math.abs(yTop-row);
      }

      // Left side collision
      if (World.isSolidTileAtPosition(xLeft, yCenter)) {
        const col = Math.floor(xLeft/tileSize)*tileSize;
        physics.Velocity.x += Math.abs(xLeft-col);
      }

      // Right side collision
      if (World.isSolidTileAtPosition(xRight, yCenter)) {
        const col = Math.floor(xRight/tileSize)*tileSize;
        physics.Velocity.x -= Math.abs(xRight-col);
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
      this.checkAndHandleOOB(entity);
    }
  }

  onRender(ctx) {
    // TODO disable debug code
    ctx.save();
    ctx.strokeStyle='red';
    for (const entity of this._registeredEntities.values()) {
      const physics = entity.getComponentByType('Physics');
      if (physics === undefined ) {
        continue;
      }
      ctx.strokeRect(
          Math.floor(physics.Position.x),
          Math.floor(physics.Position.y),
          physics.Size.x,
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
