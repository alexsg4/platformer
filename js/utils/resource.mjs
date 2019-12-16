/* eslint-disable require-jsdoc */

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

const _images = new Map();
let _isInit = false;
let _callbackFn = {};

function _init() {
  for (const imgPath of IMAGE_PATHS) {
    const imgID = _getImgIDFromURL(imgPath);
    if (_images.get(imgID)) {
      continue;
    }
    const image = new Image();
    _images.set(imgID, false);
    image.onload = () => {
      _images.set(imgID, image);
      console.log('Image was loaded: ', imgPath, imgID);
      if (_isReady()) {
        _callbackFn();
      }
    };

    image.onerror = () => {
      console.error('Error loading image');
    };
    image.src = imgPath;
  }
  _isInit = true;
}

function _isReady() {
  if (_images.size < IMAGE_PATHS.size) {
    return false;
  }
  for (const value of _images.values()) {
    if (!isNullOrUndefined(value) && !value) {
      return false;
    }
  }
  return true;
}

function _getImgIDFromURL(url) {
  if (url) {
    return url.match('/([a-z0-9\-]+)\.png')[1];
  }
}

export default {
  init(readyCallback) {
    if (!_isInit && typeof readyCallback === 'function') {
      _callbackFn = readyCallback;
      _init();
    } else if (window.dbgDisplay) {
      console.warn('Resource loader already init!');
      return;
    }
  },
  get(imageID) {
    return _images.get(imageID);
  // eslint-disable-next-line comma-dangle
  }
};
