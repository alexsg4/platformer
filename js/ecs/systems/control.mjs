/* eslint-disable require-jsdoc */
import System from '../system.mjs';
import InputManager from '../../utils/input.mjs';

const SYSTEM_TYPE = 'Control';
const COMPONENT_TYPE = 'Controller';

class ControlSystem extends System {
  constructor() {
    super(SYSTEM_TYPE, COMPONENT_TYPE);
  }

  handleAction(action, entity) {
    const physics = entity.getComponentByType('Physics');
    const speed = physics.Speed;
    const velocity = physics.Velocity;
    const visualComp = entity.getComponentByType('Visual');

    switch (action) {
      case 'moveLeft':
        velocity.x -= speed;
        visualComp.CurrentState = 'run';
        visualComp.prevDirectionX = visualComp.CurrentDirectionX;
        visualComp.CurrentDirectionX = 'left';
        break;
      case 'moveRight':
        velocity.x += speed;
        visualComp.CurrentState = 'run';
        visualComp.prevDirectionX = visualComp.CurrentDirectionX;
        visualComp.CurrentDirectionX = 'right';
        break;
      case 'crouch':
        velocity.y += speed;
        // TODO change anim
        // TODO shrink collision box
        break;
      case 'jump':
        velocity.y -= speed;
        visualComp.CurrentState = 'jump';
        break;
      case 'attack':
        visualComp.CurrentState = 'attack';
        // TODO deal damage
        break;
      default:
        break;
    }
    console.log(+physics.Position.x + '\t' +physics.Position.y);
  }

  handleUserInput(entity) {
    const visualComp = entity.getComponentByType('Visual');
    if (visualComp) {
      visualComp.CurrentState = 'idle';
    }
    const actions = entity.getComponentByType(COMPONENT_TYPE).Actions;
    for (const action of Object.keys(actions)) {
      const InputConfig = actions[action];
      const actionInputState =
        InputManager.checkInputState(InputConfig.input[0]) ||
        InputManager.checkInputState(InputConfig.input[1]);
      if (!actionInputState) {
        continue;
      }

      const actionHappened = InputConfig.hold && actionInputState.active ||
          !InputConfig.hold && actionInputState.pressed;
      if (!actionHappened) {
        continue;
      }
      this.handleAction(action, entity);
    }
  }

  onUpdate(dt) {
    for (const entity of this._registeredEntities.values()) {
      this.handleUserInput(entity);
    }
  }
};

const createControlSystem = () => {
  let controlSystem = new ControlSystem();
  controlSystem = Object.freeze(controlSystem);
  return controlSystem;
};

export default createControlSystem;
