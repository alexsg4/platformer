/* eslint-disable require-jsdoc */
import ResourceLoader from './utils/resource.mjs';
import {isNullOrUndefined} from './utils/misc.mjs';
import createEntity from './ecs/entity.mjs';

let _canvas = undefined;
let _ctx = undefined;
const _entities = new Map();
const _systems = [];
let _playerID = undefined;
let _isInitialized = false;


function _registerSystem(system) {
  if (isNullOrUndefined(system)) {
    console.warn('Game: trying to register null system!');
    return;
  }

  const systemType = system.type;
  if (!isNullOrUndefined(_systems.get(system.type))) {
    console.error('System of type: ' + systemType + ' already registered!');
    return;
  }

  _systems.set(systemType, system);
}

function _registerEntity(entity) {
  if (isNullOrUndefined(entity)) {
    console.warn('Game: trying to register null entity!');
    return;
  }
  // TODO register entity with necessary systems
  _entities.set(entity.id, entity);
}

export default {
  spawnEntity(archetype) {
    const isPlayer = archetype === 'Player';
    if (isPlayer && !isNullOrUndefined(_playerID)) {
      console.error('Game.spawnEntity: ' + 'Player already exists!');
      return;
    }

    const entity = createEntity(
        archetype,
        ResourceLoader.getArchetypeData(archetype));
    if (isNullOrUndefined(entity)) {
      console.error('Game.spawnEntity: ' + 'entity creation failed!');
      return;
    }
    _registerEntity(entity);
    if (isPlayer) {
      _playerID = entity.id;
    }
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

    this.spawnEntity('Player');
    _isInitialized = true;
    // TODO remove
    console.log(JSON.stringify(this.getPlayer()), null, 4);
  },

  update(dt) {
    for (const system of _systems) {
      if (isNullOrUndefined(system)) {
        console.warn('Game.update :' + 'system undefined!');
        continue;
      }
      system.onUpdate(dt);
    }
  },

  render() {
    for (const system of _systems) {
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

    for (const system of _systems) {
      if (isNullOrUndefined(system)) {
        continue;
      }
      system.onShutdown();
    }
  },
};
