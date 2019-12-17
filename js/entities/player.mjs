/* eslint-disable require-jsdoc */
import Entity from '../ecs/entity.mjs';
import InputManager from '../utils/input.mjs';

const MOVE_STEP = 1;

const ANIMS_BY_STATE = new Map([
  ['idle', 'player-idle'],
  ['idleSword', 'player-idle-sword'],
  ['run', 'player-run'],
  ['runSword', 'player-run-sword'],
  ['jump', 'player-jump'],
  ['attack', 'player-attack'],
  // eslint-disable-next-line comma-dangle
  ['die', 'player-die']
]);

class Player {
  constructor(pos, size) {
    this.animState = 'idle';
    this.sprite.speed = 0.1; // TODO tweak
    this.directionX = 'right';
    this.prevDirectionX = this.directionX;
    this.isFlipped = false;
    return this;
  }

  onUpdate(dt) {
    this.animState = 'idle';

    if (InputManager.isPressedUp()) {
      this.animState = 'jump';
      this.position.y -= MOVE_STEP;
    }

    if (InputManager.isPressedDown()) {
      this.position.y += MOVE_STEP;
    }

    if (InputManager.isPressedLeft()) {
      this.position.x -= MOVE_STEP;
      this.animState = 'run';
      this.directionX = 'left';
    }

    if (InputManager.isPressedRight()) {
      this.position.x += MOVE_STEP;
      this.animState = 'run';
      this.directionX = 'right';
    }
    super.onUpdate(dt);
  }

  onRender(ctx) {
    let animState = ANIMS_BY_STATE.get(this.animState);
    if (this.isFlipped) {
      animState = animState.concat('-flip');
    }
    if (this.prevDirectionX.localeCompare(this.directionX) !== 0) {
      if (animState.includes('-flip')) {
        animState = animState.replace('-flip', '');
        this.isFlipped = false;
      } else {
        animState = animState.concat('-flip');
        this.isFlipped = true;
      }
      this.prevDirectionX = this.directionX;
    }
    this.sprite.imgId = animState !== undefined ? animState : 'idle';
    super.onRender(ctx);
  }
}

export default Player;
