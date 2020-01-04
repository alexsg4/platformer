/* eslint-disable require-jsdoc */
import {isNullOrUndefined} from './utils/misc.mjs';

import ResourceLoader from './utils/resource.mjs';
import createEntity from './ecs/entity.mjs';

import createControlSystem from './ecs/systems/control.mjs';
import createPhysicsSystem from './ecs/systems/physics.mjs';
import createCollisionSystem from './ecs/systems/collision.mjs';
import createMovementSystem from './ecs/systems/movement.mjs';
import createVisualSystem from './ecs/systems/visual.mjs';
import createHealthSystem from './ecs/systems/health.mjs';

import Camera from './camera.mjs';
import World from './world.mjs';

let _canvas = undefined;
let _ctx = undefined;
let _camera = undefined;
const _entities = new Map();
const _systems = [];
let _playerID = undefined;
let _isInitialized = false;

const SCALE = 2;

function _registerSystem(system) {
  if (isNullOrUndefined(system)) {
    console.warn('Game: trying to register null system!');
    return;
  }

  const sysType = system.getType();
  if (!isNullOrUndefined(_systems.find( (system) =>
    (system.getType() === sysType)))) {
    console.error('System already registered!');
    return;
  }

  _systems.push(system);
  system.onInit();
}

function _unRegisterSystem(system) {
  if (isNullOrUndefined(system)) {
    console.warn('Game: trying to unRegister null system!');
    return;
  }
  _systems.splice(_systems.indexOf(system), 1);
}

function _registerEntity(entity) {
  if (isNullOrUndefined(entity)) {
    console.warn('Game: trying to register null entity!');
    return;
  }

  for (const system of _systems) {
    system.registerEntity(entity);
  }
  _entities.set(entity.getID(), entity);
}

function _unRegisterEntity(entity) {
  if (isNullOrUndefined(entity)) {
    console.warn('Game: trying to unregister null entity!');
    return;
  }
  for (const system of _systems) {
    system.unRegisterEntity(entity);
  }
  _entities.delete(entity.getID());
}

export default {
  spawnNewEntity(archetype) {
    const isPlayer = archetype === 'Player';
    if (isPlayer && !isNullOrUndefined(_playerID)) {
      console.error('Game.spawnNewEntity: ' + 'Player already exists!');
      return;
    }

    const entity = createEntity(
        archetype,
        ResourceLoader.getArchetypeData(archetype));
    if (isNullOrUndefined(entity)) {
      console.error('Game.spawnNewEntity: ' + 'entity creation failed!');
      return;
    }
    _registerEntity(entity);
    if (isPlayer) {
      _playerID = entity.getID();
    }
  },

  unSpawnEntity(entity) {
    _unRegisterEntity(entity);
  },

  getPlayer() {
    return _entities.get(_playerID);
  },

  getEntity(id) {
    if (isNullOrUndefined(id) || typeof id !== 'number') {
      console.warn('Game.getEntity: invalid id');
      return undefined;
    }
    return _entities.get(id);
  },

  init() {
    if (_isInitialized) {
      console.error('Game is already initialized!');
      return;
    }

    _canvas = document.getElementById('game-area');
    _ctx = _canvas.getContext('2d');
    _ctx.imageSmoothingEnabled = false;
    _ctx.scale(SCALE, SCALE);

    _isInitialized = true;
    _registerSystem(createControlSystem());
    _registerSystem(createPhysicsSystem());
    _registerSystem(createCollisionSystem());
    _registerSystem(createMovementSystem());
    _registerSystem(createVisualSystem());
    _registerSystem(createHealthSystem(this.unSpawnEntity));

    this.spawnNewEntity('Player');
    // TODO remove test code
    this.spawnNewEntity('Frog');

    const worldInfo = {
      mapSize: World.getSize(),
      tileSize: World.getTileSize(),
    };
    _camera = new Camera(
        this.getPlayer(),
        _canvas.width,
        _canvas.height,
        SCALE,
        worldInfo,
    );
  },

  update(dt) {
    for (const system of _systems) {
      if (isNullOrUndefined(system)) {
        console.warn('Game.update :' + 'system undefined!');
        continue;
      }
      system.onUpdate(dt);
    }
    _camera.onUpdate(dt);
  },

  render() {
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
    _ctx.save();
    const cameraPos = _camera.getPosition();
    _ctx.translate(-cameraPos.x, -cameraPos.y);
    World.draw(_ctx);
    for (const system of _systems.values()) {
      if (isNullOrUndefined(system)) {
        console.warn('Game.render :' + 'system undefined!');
        continue;
      }
      system.onRender(_ctx);
    }
    _ctx.restore();
  },

  shutdown() {
    if (!_isInitialized) {
      console.warn('Game.shutdown :' + 'game is not initialized.');
      return;
    }
    _isInitialized = false;

    for (const system of _systems.values()) {
      if (isNullOrUndefined(system)) {
        continue;
      }
      system.onShutdown();
    }
  },
};
