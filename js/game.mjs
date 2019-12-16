/* eslint-disable require-jsdoc */
import Entity from './ecs/entity.mjs';
import Player from './entities/player.mjs';
import Vector2D from './utils/math/vector2d.mjs';

import Component from './ecs/component.mjs';


class Game {
  constructor() {
    this.entities = new Map();

    return this;
  }

  init() {
    this.canvas = document.getElementById('game-area');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    const playerStart = new Vector2D(
        this.canvas.width/2,
        this.canvas.height/2);

    const player = new Player(
        new Vector2D(playerStart.x, playerStart.y),
        new Vector2D(50, 37));
    this.entities.set(player.id, player);
  }

  update(dt) {
    for (const entity of this.entities.values()) {
      entity.onUpdate(dt);
    }
  }

  render() {
    // TODO maybe not clean the entire canvas on every frame
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const entity of this.entities.values()) {
      entity.onRender(this.ctx);
    }
  }
};

export default Game;
