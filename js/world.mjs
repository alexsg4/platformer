/* eslint-disable require-jsdoc */

import {isNullOrUndefined} from './utils/misc.mjs';
import ResourceLoader from './utils/resource.mjs';

const ALLOWED_TILES = {
  'DUS': [null, 'DU1', 'DU2'],
  'DU1': ['DU2', 'DUE'],
  'DU2': ['DU1', 'DUE'],
  'DUE': [null, 'ANY'],
  'DMS': [2, 1],
  'DM1': [2, 2],
  'DM2': [2, 4],
  'DME': [2, 3],
  'DLS': [3, 1],
  'DL1': [3, 2],
  'DL2': [3, 4],
  'WKS': [2, 7],
  'WK1': [2, 8],
  'WK2': [2, 9],
  'WK3': [3, 7],
  'WK4': [3, 8],
  'WKE': [3, 9],
  'FES': [4, 6],
  'FE1': [4, 7],
  'FE2': [4, 8],
  'FEE': [4, 9],
  'BRS': [5, 6],
  'BR1': [5, 7],
  'BR2': [5, 8],
  'BRE': [5, 9],
  'BSS': [6, 6],
  'BS1': [6, 7],
  'BSE': [6, 8],
  'SPK': [6, 9],
};

const DEBUG_TEXT = false;

const WORLD_TILES = [
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, 'FES', 'FE1', 'FEE', null, null, null],
  ['WKS', 'WK1', 'WK1', 'WK1', 'WK1', 'WK2', 'WK1', 'WKE'],
  [null, null, 'DL2', 'DL1', 'DL1', 'DL2', 'DL1', 'DL2'],
];

const TILE_SIZE = 16;

const WORLD_MAP_SIZE = {
  x: 8,
  y: 8,
};

function isSolidTile(tileType) {
  if (tileType === null) {
    return false;
  }
  return (
    tileType.match('WK*') !== null ||
    tileType.match('DL*') !== null
  );
}

function drawTiles(ctx, tileConfig) {
  const tileAtlas = ResourceLoader.getImage('world-tiles');

  if (DEBUG_TEXT) {
    console.log('------- TILE DRAW START -------');
  }

  for (let row = 0; row < tileConfig.length; row++) {
    for (let col = 0; col < tileConfig[row].length; col++) {
      const tileType = tileConfig[row][col];
      if (tileType !== null) {
        const tileImgCoords = ResourceLoader.getTileImageCoordsByType(tileType);
        if (isNullOrUndefined(tileImgCoords)) {
          console.warn('Tile Imgage coords not found for: ' + tileType);
          continue;
        }
        const x = col * TILE_SIZE;
        const y = row * TILE_SIZE;

        if (DEBUG_TEXT) {
          console.log('Drawing tile ' + tileType +' at: ' + x + ' ' + y);
        }

        ctx.drawImage(
            tileAtlas,
            tileImgCoords.x, tileImgCoords.y,
            TILE_SIZE, TILE_SIZE,
            x, y,
            TILE_SIZE, TILE_SIZE,
        );
      }
    }
  }
  if (DEBUG_TEXT) {
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
  for (let r = 0; r < WORLD_MAP_SIZE.x; r++) {
    for (let c = 0; c < WORLD_MAP_SIZE.y; c++) {
      x = Math.floor(r * TILE_SIZE);
      y = Math.floor(c * TILE_SIZE);
      ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
      if (isSolidTile(WORLD_TILES[c][r])) {
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      }
    }
  }
  ctx.restore();
}

export default {
  draw(ctx) {
    drawTiles(ctx, WORLD_TILES);
    // TODO disable
    drawGrid(ctx);
  },

  isSolidTileAtPosition(x, y) {
    const xIndex = Math.floor(x/TILE_SIZE);
    const yIndex = Math.floor(y/TILE_SIZE);
    if (xIndex >= 0 && xIndex < WORLD_TILES.length ) {
      if (yIndex >= 0 && yIndex < WORLD_TILES[xIndex].length) {
        return isSolidTile(WORLD_TILES[yIndex][xIndex]);
      }
    }
    return false;
  },

  getSize() {
    return WORLD_MAP_SIZE;
  },

  getTileSize() {
    return TILE_SIZE;
  },
};
