/* eslint-disable require-jsdoc */
import * as utils from './utils/misc.mjs';
import InputManager from './utils/input.mjs';
import Entity from './ecs/entity.mjs';
import Vector2D from './utils/math/vector2d.mjs';

import Component from './ecs/component.mjs';

const MOVE_STEP = 2;

class Game {
  constructor() {
    this.entities = new Map();

    return this;
  }

  init() {
    this.canvas = document.getElementById('game-area');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    InputManager.init();

    // TODO remove test code
    /*
    for (let i = 1; i < 5; i++) {
      const testEntity = new Entity();
      const comp1 = new Component();
      const comp2 = new Component();
      testEntity.attachComponents(comp1, comp2);
      this.entities.set(testEntity.id, testEntity);
    }
    */
    this.x = this.canvas.width/2;
    this.y = this.canvas.height/2;
    this.timeSinceColorChange = 0;

    const player = new Entity(
        new Vector2D(this.x, this.y),
        new Vector2D(50, 37),
        'player-idle');
    this.entities.set(player.id, player);
  }

  update(dt) {
    for (const entity of this.entities.values()) {
      entity.onUpdate(dt);
    }

    // TODO maybe move input handling to PlayerController class
    // and just pass the pressed keys to that class here
    if (InputManager.isPressedUp()) {
      this.y -= MOVE_STEP;
    }

    if (InputManager.isPressedDown()) {
      this.y += MOVE_STEP;
    }

    if (InputManager.isPressedLeft()) {
      this.x -= MOVE_STEP;
    }

    if (InputManager.isPressedRight()) {
      this.x += MOVE_STEP;
    }

    // TODO remove test code
    // demo: just change ball color every 3 seconds
    if (this.timeSinceColorChange >= 2 * 1000000) {
      this.color = utils.generateRandomColor();
      this.timeSinceColorChange = 0;
    } else {
      this.timeSinceColorChange += Math.floor(dt);
    }
  }

  render() {
    // TODO maybe not clean the entire canvas on every frame
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const entity of this.entities.values()) {
      entity.onRender(this.ctx);
    }

    /*
    // TODO remove test code
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 10, 0, Math.PI*2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  */
  }
};

export default Game;
