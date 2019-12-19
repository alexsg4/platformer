/* eslint-disable require-jsdoc */
import ResourceLoader from './utils/resource.mjs';
import {isNullOrUndefined} from './utils/misc.mjs';
import createEntity from './ecs/entity.mjs';
import createPhysicsSystem from './ecs/systems/physics.mjs';
import createControlSystem from './ecs/systems/control.mjs';
import createVisualSystem from './ecs/systems/visual.mjs';

let _canvas = undefined;
let _ctx = undefined;
const _entities = new Map();
const _systems = new Map();
let _playerID = undefined;
let _isInitialized = false;

function _registerSystem(system) {
  if (isNullOrUndefined(system)) {
    console.warn('Game: trying to register null system!');
    return;
  }

  const sysType = system.getType();
  if (!isNullOrUndefined(_systems.get(sysType))) {
    console.error('System already registered!');
    return;
  }

  _systems.set(sysType, system);
  system.onInit();
}

function _unRegisterSystem(system) {
  if (isNullOrUndefined(system)) {
    console.warn('Game: trying to unRegister null system!');
    return;
  }
  _systems.delete(system.getType());
}

function _registerEntity(entity) {
  if (isNullOrUndefined(entity)) {
    console.warn('Game: trying to register null entity!');
    return;
  }

  for (const system of _systems.values()) {
    system.registerEntity(entity);
  }
  _entities.set(entity.getID(), entity);
}

function _unRegisterEntity(entity) {
  if (isNullOrUndefined(entity)) {
    console.warn('Game: trying to unregister null entity!');
    return;
  }
  for (const system of _systems.values()) {
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

    _isInitialized = true;
    _registerSystem(createControlSystem());
    _registerSystem(createPhysicsSystem());
    _registerSystem(createVisualSystem());

    this.spawnNewEntity('Player');
    this.spawnNewEntity('Frog');
  },

  update(dt) {
    for (const system of _systems.values()) {
      if (isNullOrUndefined(system)) {
        console.warn('Game.update :' + 'system undefined!');
        continue;
      }
      system.onUpdate(dt);
    }
  },

  render() {
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
    for (const system of _systems.values()) {
      if (isNullOrUndefined(system)) {
        console.warn('Game.render :' + 'system undefined!');
        continue;
      }
      system.onRender(_ctx);
    }
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
