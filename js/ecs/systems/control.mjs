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
    const weapon = entity.getComponentByType('Weapon');
    weapon.isAttacking = false;

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
        break;
      case 'jump':
        velocity.y -= speed;
        visualComp.CurrentState = 'jump';
        break;
      case 'attack':
        visualComp.CurrentState = 'attack';
        weapon.isAttacking = true;
        break;
      default:
        break;
    }
    // console.log(+physics.Position.x + '\t' +physics.Position.y);
  }

  handleUserInput(entity) {
    const actions = entity.getComponentByType(COMPONENT_TYPE).Actions;
    let isIdle = true;
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
      if (actionHappened) {
        this.handleAction(action, entity);
        isIdle = false;
      }
    }
    const visualComp = entity.getComponentByType('Visual');
    if (visualComp && isIdle) {
      visualComp.CurrentState = 'idle';
    }
  }

  onUpdate(dt) {
    for (const entity of this._registeredEntities.values()) {
      this.handleUserInput(entity);
    }
  }
};

const createControlSystem = () => {
  const controlSystem = new ControlSystem();
  return controlSystem;
};

export default createControlSystem;
