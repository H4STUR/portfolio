import { PLAYER_RADIUS } from './constants.js';

// 0 = empty, 1+ = wall texture index (see TEX_BY_INDEX in engine.js).
// Designed as a 16x16 arena with two inner box rooms to give depth cues.
export const MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,2,2,2,2,0,0,0,0,0,1],
  [1,0,0,0,0,0,2,0,0,2,0,0,0,0,0,1],
  [1,0,0,0,0,0,2,0,0,2,0,0,0,0,0,1],
  [1,0,0,0,0,0,2,2,2,2,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,3,3,3,3,0,0,0,0,0,1],
  [1,0,0,0,0,0,3,0,0,3,0,0,0,0,0,1],
  [1,0,0,0,0,0,3,0,0,3,0,0,0,0,0,1],
  [1,0,0,0,0,0,3,3,3,3,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

export const MAP_H = MAP.length;
export const MAP_W = MAP[0].length;

// Spawn in NW corner facing SE — gives a diagonal opening view with both inner boxes visible.
export const PLAYER_START = { x: 2.5, y: 2.5, angle: Math.PI / 4 };

export function getTile(tx, ty) {
  if (tx < 0 || tx >= MAP_W || ty < 0 || ty >= MAP_H) return 1;
  return MAP[ty][tx];
}

export function isWallAt(wx, wy) {
  return getTile(Math.floor(wx), Math.floor(wy)) > 0;
}

function collidesAt(wx, wy) {
  const r = PLAYER_RADIUS;
  return isWallAt(wx - r, wy - r) ||
         isWallAt(wx + r, wy - r) ||
         isWallAt(wx - r, wy + r) ||
         isWallAt(wx + r, wy + r);
}

// Axis-separated movement: lets the player slide along walls instead of sticking.
export function moveWithCollision(player, dx, dy) {
  const nx = player.x + dx;
  if (!collidesAt(nx, player.y)) player.x = nx;
  const ny = player.y + dy;
  if (!collidesAt(player.x, ny)) player.y = ny;
}
