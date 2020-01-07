/* eslint-disable require-jsdoc */
/* eslint-disable comma-dangle */

import {isNullOrUndefined} from './misc.mjs';

const IMAGE_PATHS = [
  '../assets/sprites/food-tile.png',
  '../assets/sprites/enemy/nm-bat.png',
  '../assets/sprites/enemy/nm-frog.png',
  '../assets/sprites/enemy/nm-ghost.png',
  '../assets/sprites/enemy/nm-skeleton.png',
  '../assets/sprites/enemy/nm-bat-flip.png',
  '../assets/sprites/enemy/nm-frog-flip.png',
  '../assets/sprites/enemy/nm-ghost-flip.png',
  '../assets/sprites/enemy/nm-skeleton-flip.png',
  '../assets/sprites/fx/fx-explosion-1.png',
  '../assets/sprites/fx/fx-projectile-1.png',
  '../assets/sprites/item/item-chest.png',
  '../assets/sprites/item/item-coin.png',
  '../assets/sprites/item/item-heart.png',
  '../assets/sprites/item/item-potion-purple.png',
  '../assets/sprites/item/item-potion-red.png',
  '../assets/sprites/player/player-attack.png',
  '../assets/sprites/player/player-die.png',
  '../assets/sprites/player/player-idle-sword.png',
  '../assets/sprites/player/player-idle.png',
  '../assets/sprites/player/player-jump.png',
  '../assets/sprites/player/player-run-sword.png',
  '../assets/sprites/player/player-run.png',
  '../assets/sprites/player/player-attack-flip.png',
  '../assets/sprites/player/player-die-flip.png',
  '../assets/sprites/player/player-idle-sword-flip.png',
  '../assets/sprites/player/player-idle-flip.png',
  '../assets/sprites/player/player-jump-flip.png',
  '../assets/sprites/player/player-run-sword-flip.png',
  '../assets/sprites/player/player-run-flip.png',
  '../assets/sprites/world/world-bg-cloud.png',
  '../assets/sprites/world/world-bg-mountain.png',
  '../assets/sprites/world/world-fg-cloud.png',
  '../assets/sprites/world/world-fg-mountain.png',
  '../assets/sprites/world/world-tiles.png',
  '../assets/sprites/world/world-trees.png'];

// state
let _isInit = false;
let _readyCallback = undefined;

// data
const _images = new Map();
let _tileMapData = undefined;
let _archetypeData = undefined;
let _testMap = undefined;

function _isReady() {
  if (_images.size < IMAGE_PATHS.size ||
    isNullOrUndefined(_tileMapData)||
    isNullOrUndefined(_archetypeData)||
    isNullOrUndefined(_testMap)) {

    return false;
  }

  // check all images have been loaded
  for (const value of _images.values()) {
    if (!isNullOrUndefined(value) && !value) {
      return false;
    }
  }
  return true;
}

function _checkAndHandleReady() {
  if (_isReady()) {
    Object.freeze(_images);
    Object.freeze(_tileMapData);
    Object.freeze(_archetypeData);

    if (!isNullOrUndefined(_readyCallback)) {
      _readyCallback();
    } else {
      console.error('Resource loader: Ready callback undefined!');
    }
  }
}

function _loadImages() {
  for (const imgPath of IMAGE_PATHS) {
    const imgID = _getImgIDFromURL(imgPath);
    if (_images.get(imgID)) {
      continue;
    }
    const image = new Image();
    _images.set(imgID, false);
    image.onload = () => {
      _images.set(imgID, image);
      if (window.dbgDisplay) {
        console.log('Image was loaded: ', imgPath, imgID);
      }
      _checkAndHandleReady();
    };

    image.onerror = () => {
      console.error('Error loading image');
    };
    image.src = imgPath;
  }
}

// TODO refacto into a single method
function _loadTileMapData() {
  const httpReq = new XMLHttpRequest();
  httpReq.open('GET', window.location + '/assets/tilemap.json');
  httpReq.responseType = 'json';
  httpReq.send();
  httpReq.onload = () => {
    _tileMapData = httpReq.response;
    _checkAndHandleReady();
  };
}

function _loadArchetypeData() {
  const httpReq = new XMLHttpRequest();
  httpReq.open('GET', window.location + '/js/ecs/archetype.json');
  httpReq.responseType = 'json';
  httpReq.send();
  httpReq.onload = () => {
    _archetypeData = httpReq.response;
    _checkAndHandleReady();
  };
}

function _loadTestMapData() {
  const httpReq = new XMLHttpRequest();
  httpReq.open('GET', window.location + '/assets/testMap.json');
  httpReq.responseType = 'json';
  httpReq.send();
  httpReq.onload = () => {
    _testMap = httpReq.response;
    _checkAndHandleReady();
  };
}

function _init() {
  _loadImages();
  _loadTileMapData();
  _loadArchetypeData();
  _loadTestMapData();
  _isInit = true;
}

function _getImgIDFromURL(url) {
  if (url) {
    return url.match('/([a-z0-9\-]+)\.png')[1];
  }
}

export default {
  init(readyCallback) {
    if (!_isInit && typeof readyCallback === 'function') {
      _readyCallback = readyCallback;
      _init();
    } else if (window.dbgDisplay) {
      console.warn('Resource loader already init!');
      return;
    }
  },

  getImage(imageID) {
    return _images.get(imageID);
  },

  getTileImageCoordsByType(imgType) {
    const coords = {x: 0, y: 0};
    const tileMapCoords = _tileMapData.TilePositions[imgType];
    if (isNullOrUndefined(tileMapCoords)) {
      return undefined;
    }
    coords.x = (tileMapCoords[1] - 1) * _tileMapData.TileSize;
    coords.y = (tileMapCoords[0] - 1) * _tileMapData.TileSize;
    return coords;
  },

  getTileSize() {
    return _tileMapData.TileSize;
  },

  getArchetypeData(archetype) {
    if (typeof archetype !== 'string' || isNullOrUndefined(archetype)) {
      console.warn('Trying to get data for non-existent archetype!');
      return undefined;
    }
    return _archetypeData[archetype];
  },

  getTestMap() {
    return _testMap;
  }
};
