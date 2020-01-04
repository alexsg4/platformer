/* eslint-disable require-jsdoc */
import System from '../system.mjs';
import Sprite from '../../sprite.mjs';
import Vector2D from '../../utils/math/vector2d.mjs';

const SYSTEM_TYPE = 'Visual';
const COMPONENT_TYPE = 'Visual';

class VisualSystem extends System {
  constructor() {
    super(SYSTEM_TYPE, COMPONENT_TYPE);
    this._sprites = new Map();
  }

  getAnimStateImage(visualComp) {
    const currentState = visualComp.CurrentState;
    let imageID = visualComp.AnimationStates[currentState] ||
      visualComp.AnimationStates['all'];

    if (visualComp.CurrentDirectionX !== visualComp.PrevDirectionX) {
      if (imageID.includes('-flip')) {
        imageID = imageID.replace('-flip', '');
      } else {
        imageID = imageID.concat('-flip');
      }
    }
    return imageID;
  }

  registerEntity(entity) {
    if (super.registerEntity(entity)) {
      const visualComp = entity.getComponentByType('Visual');
      const physicsComp = entity.getComponentByType('Physics');

      const sprite = new Sprite(
          new Vector2D(physicsComp.Position.x, physicsComp.Position.y),
          new Vector2D(physicsComp.Size.x, physicsComp.Size.y),
          visualComp.Speed,
          true // loop
          // TODO make loop configurable in file
      );
      this._sprites.set(entity.getID(), sprite);
    }
  }

  unRegisterEntity(entity) {
    if (super.unRegisterEntity(entity)) {
      this._sprites.delete(entity.getID());
    }
  }

  onUpdate(dt) {
    for (const entity of this._registeredEntities.values()) {
      const sprite = this._sprites.get(entity.getID());
      const comp = entity.getComponentByType(COMPONENT_TYPE);
      const physics = entity.getComponentByType('Physics');

      sprite.pos.x = physics.Position.x;
      sprite.pos.y = physics.Position.y;
      sprite.size.x = physics.Size.x;
      sprite.size.y = physics.Size.y;
      sprite.imgId = this.getAnimStateImage(comp);

      sprite.onUpdate(dt);
    }
  }

  onRender(ctx) {
    for (const sprite of this._sprites.values()) {
      sprite.onRender(ctx);
    }
  }

  onShutdown() {
    this._sprites.clear();
    super.onShutdown();
  }
};

const createVisualSystem = () => {
  const system = new VisualSystem();
  return system;
};

export default createVisualSystem;
