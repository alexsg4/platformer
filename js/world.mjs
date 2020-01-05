/* eslint-disable require-jsdoc */

import {isNullOrUndefined} from './utils/misc.mjs';
import ResourceLoader from './utils/resource.mjs';

const ANY = 'ANY';
const TILE_GRAMMAR = {
  'DUS': [null, 'DU1', 'DU2'],
  'DU1': [null, 'DU1', 'DU2', 'DUE'],
  'DU2': [null, 'DU1', 'DU2', 'DUE'],
  'DUE': [null, ANY],
  'DMS': [null, 'DM1', 'DM2'],
  'DM1': [null, 'DM1', 'DM2', 'DME'],
  'DM2': [null, 'DM1', 'DM2', 'DME'],
  'DME': [null, ANY],
  'DLS': [null, 'DL1', 'DL2'],
  'DL1': [null, 'DL1', 'DL2', 'DLE'],
  'DL2': [null, 'DL1', 'DL2', 'DLE'],
  'DLE': [null, ANY],
  'WKS': [null, 'WK1', 'WK2', 'WK3', 'WK4'],
  'WK1': [null, 'WK1', 'WK2', 'WK3', 'WK4', 'WKE'],
  'WK2': [null, 'WK1', 'WK2', 'WK3', 'WK4', 'WKE'],
  'WK3': [null, 'WK1', 'WK2', 'WK3', 'WK4', 'WKE'],
  'WK4': [null, 'WK1', 'WK2', 'WK3', 'WK4', 'WKE'],
  'WKE': [null, ANY],
  'FES': [null, 'FE1', 'FE2'],
  'FE1': [null, 'FE1', 'FE2', 'FEE'],
  'FE2': [null, 'FE1', 'FE2', 'FEE'],
  'FEE': [null, ANY],
  'BRS': [null, 'BR1', 'BR2'],
  'BR1': [null, 'BR1', 'BR2', 'BRE'],
  'BR2': [null, 'BR1', 'BR2', 'BRE'],
  'BRE': [null, ANY],
  'BSS': [null, 'BS1'],
  'BS1': [null, 'BS1', 'BSE'],
  'BSE': [null, ANY],
  'SPK': [null, 'SPK', ANY],
};

// init with test config by default
let WORLD_TILES = [
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  null, null, 'FES', 'FE1', 'FEE', null, null, null,
  'WKS', 'WK1', 'WK1', 'WK1', 'WK1', 'WK2', 'WK1', 'WKE',
  null, null, 'DL2', 'DL1', 'DL1', 'DL2', 'DL1', 'DL2',
];

const DEFAULT_MAP_SIZE = {col: 8, row: 8};
const WORLD_MAP_SIZE = {col: 8, row: 8};
const TILE_SIZE = 16;

function isSolidTile(tileType) {
  if (tileType === null) {
    return false;
  }

  if (tileType === undefined && window.GameParams.DebugText) {
    console.warn('TileType is undefined.');
    return false;
  }

  return (
    tileType.match('WK*') !== null ||
    tileType.match('D[UML]*') !== null ||
    tileType.match('BR[0-9]') !== null ||
    tileType.match('SPK')
  );
}

function drawTiles(ctx) {
  const tileAtlas = ResourceLoader.getImage('world-tiles');

  if (window.GameParams.DebugText) {
    console.log('------- TILE DRAW START -------');
  }

  for (let i = 0; i < WORLD_TILES.length; i++) {
    const tileType = WORLD_TILES[i];
    if (tileType !== null) {
      const tileImgCoords = ResourceLoader.getTileImageCoordsByType(tileType);
      if (isNullOrUndefined(tileImgCoords)) {
        console.warn('Tile Image coords not found for: ' + tileType);
        continue;
      }
      const col = i % WORLD_MAP_SIZE.col * TILE_SIZE;
      const row = Math.floor(i / WORLD_MAP_SIZE.col) * TILE_SIZE;

      if (window.GameParams.DebugText) {
        console.log('Drawing tile ' + tileType +' at: ' + col + ' ' + row);
      }

      ctx.drawImage(
          tileAtlas,
          tileImgCoords.x, tileImgCoords.y,
          TILE_SIZE, TILE_SIZE,
          col, row,
          TILE_SIZE, TILE_SIZE,
      );
    }
  }

  if (window.GameParams.DebugText) {
    console.log('------- TILE DRAW END -------');
  }
}

function drawGrid(ctx) {
  let x;
  let y;
  ctx.save();
  ctx.lineWidth = 1;
  ctx.fillStyle = 'red';
  ctx.globalAlpha = 0.4;
  for (let c = 0; c < WORLD_MAP_SIZE.col; c++) {
    for (let r = 0; r < WORLD_MAP_SIZE.row; r++) {
      x = Math.floor(c * TILE_SIZE);
      y = Math.floor(r * TILE_SIZE);
      ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
      if (isSolidTile(WORLD_TILES[c + r * WORLD_MAP_SIZE.col])) {
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      }
    }
  }
  ctx.restore();
}

function getRandomArrayElement(array, generator) {
  if (isNullOrUndefined(array)) {
    console.error('Array does not exist');
    return null;
  }

  let index = 0;
  if (isNullOrUndefined(generator)) {
    index = Math.floor(Math.random() * array.length);
  } else {
    index = generator(array);
  }
  return array[index];
}

function getNextTile(prevTileType) {
  if (isNullOrUndefined(prevTileType)) {
    return getAnyTile();
  }

  const tileCandidates = TILE_GRAMMAR[prevTileType];
  if (isNullOrUndefined(tileCandidates)) {
    return null;
  }

  const candidate = getRandomArrayElement(tileCandidates);
  if (candidate === ANY) {
    return getAnyTile();
  }

  return candidate;
}

function getAnyTile() {
  const tiles = Object.keys(TILE_GRAMMAR);
  return getRandomArrayElement(tiles);
}

export default {
  init(cols, rows) {
    WORLD_MAP_SIZE.col = typeof cols === 'number' ? cols : DEFAULT_MAP_SIZE.col;
    WORLD_MAP_SIZE.row = typeof rows === 'number' ? rows : DEFAULT_MAP_SIZE.row;

    WORLD_TILES = new Array(WORLD_MAP_SIZE.col * WORLD_MAP_SIZE.row).fill(null);
    const initialTile = 'WKS';
    const emptyRows = 5;
    const startingTilePos = emptyRows * WORLD_MAP_SIZE.col + 1;
    WORLD_TILES[startingTilePos] = initialTile;

    // eslint-disable-next-line max-len
    for (let i = startingTilePos + 1; i < WORLD_TILES.length; i++) {
      WORLD_TILES[i] = getNextTile(WORLD_TILES[i-1]);
    }
  },

  draw(ctx) {
    drawTiles(ctx);
    if (window.GameParams.DebugOverlay) {
      drawGrid(ctx);
    }
  },

  isSolidTileAtPosition(x, y) {
    const col = Math.floor(x/TILE_SIZE);
    const row = Math.floor(y/TILE_SIZE);
    if (col < 0 || col >= WORLD_MAP_SIZE.col ||
      row < 0 || row >= WORLD_MAP_SIZE.row) {
      if (window.GameParams.DebugText) {
        console.warn('Tile not preset at row: ', row, ' column: ', col);
      }
      return false;
    }
    if (window.GameParams.DebugText) {
      console.log('Tile test row: ', row, ' column: ', col);
    }
    return isSolidTile(WORLD_TILES[col + row * WORLD_MAP_SIZE.col]);
  },

  getSize() {
    return WORLD_MAP_SIZE;
  },

  getTileSize() {
    return TILE_SIZE;
  },
};
