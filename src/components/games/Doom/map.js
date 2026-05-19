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

// Enemy type → Doom sprite prefix (4 chars, matches our extracted Freedoom assets).
// Frame letters: A = idle, B-D = walk, E = attack, F-H = death (added in later phases).
export const ENEMY_TYPES = {
  zombieman: { spritePrefix: 'POSS' },
  // imp:   { spritePrefix: 'TROO' },   // Phase 5
  // pinky: { spritePrefix: 'SARG' },   // Phase 5
};

// Phase 2: static enemies (no AI). Placed for varied viewing angles from spawn:
//  - close & visible (test scale + rotation as you circle)
//  - mid-distance & occluded by box1 from spawn (test Z-buffer; walk around to find)
//  - far in open area, facing north (test long-range rendering + a 3rd rotation)
export const ENTITIES = [
  { type: 'zombieman', x: 5.5,  y: 5.5,  angle: 0 },
  { type: 'zombieman', x: 11.5, y: 8.5,  angle: Math.PI },
  { type: 'zombieman', x: 12.0, y: 11.0, angle: -Math.PI / 2 },
];

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

// Same DDA the renderer uses, exposed for hitscan / line-of-sight queries.
// Returns the perpendicular distance from player to the first wall in direction (dirX, dirY).
export function castWallRay(player, dirX, dirY, maxIterations = 64) {
  let mapX = Math.floor(player.x);
  let mapY = Math.floor(player.y);
  const deltaDistX = dirX === 0 ? 1e30 : Math.abs(1 / dirX);
  const deltaDistY = dirY === 0 ? 1e30 : Math.abs(1 / dirY);
  let stepX, sideDistX, stepY, sideDistY, side = 0;
  if (dirX < 0) { stepX = -1; sideDistX = (player.x - mapX) * deltaDistX; }
  else          { stepX =  1; sideDistX = (mapX + 1.0 - player.x) * deltaDistX; }
  if (dirY < 0) { stepY = -1; sideDistY = (player.y - mapY) * deltaDistY; }
  else          { stepY =  1; sideDistY = (mapY + 1.0 - player.y) * deltaDistY; }
  for (let i = 0; i < maxIterations; i++) {
    if (sideDistX < sideDistY) {
      sideDistX += deltaDistX; mapX += stepX; side = 0;
    } else {
      sideDistY += deltaDistY; mapY += stepY; side = 1;
    }
    if (mapX < 0 || mapX >= MAP_W || mapY < 0 || mapY >= MAP_H) return 1e9;
    if (MAP[mapY][mapX] > 0) {
      return (side === 0)
        ? (mapX - player.x + (1 - stepX) / 2) / dirX
        : (mapY - player.y + (1 - stepY) / 2) / dirY;
    }
  }
  return 1e9;
}
