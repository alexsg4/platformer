/* eslint-disable require-jsdoc */
import Entity from './ecs/entity.mjs';
import Player from './entities/player.mjs';
import Vector2D from './utils/math/vector2d.mjs';

class Game {
  constructor() {
    this.entities = new Map();

    return this;
  }

  spawnPlayer() {
    const playerStart = new Vector2D(
        this.canvas.width/2,
        this.canvas.height/2);

    const player = new Player(
        playerStart,
        new Vector2D(50, 37));
    this.playerID = player.id;
    this.entities.set(this.playerID, player);
  }

  getPlayer() {
    return this.entities.get(this.playerID);
  }

  init() {
    this.canvas = document.getElementById('game-area');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.spawnPlayer();

    // TODO - testing enemies
    const enemyStart = this.getPlayer().position;
    enemyStart.add(new Vector2D(100, 50));
    const enemy = new Entity(
        enemyStart,
        new Vector2D(16, 16),
        'nm-frog');
    this.entities.set(enemy.id, enemy);
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
