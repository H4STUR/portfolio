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

// Enemy type config — sprite prefix + per-type stats. AI uses these directly so
// adding a new enemy type is just a new entry + sprites + sounds. Frame letters
// match Doom's info.c state table (each enemy uses different letters for pain /
// death depending on how many walk/attack frames precede them in the WAD).
export const ENEMY_TYPES = {
  zombieman: {
    spritePrefix: 'POSS',
    hp: 20,
    speed: 1.2,
    walkFrames: ['B', 'C', 'D'],
    painFrame: 'G',
    attackFrame: 'E',
    deathFrames: ['H', 'I', 'J', 'K', 'L'],
    attackType: 'hitscan',
    damage: 8,
    accuracy: 0.6,
    minApproach: 0.6,
    attackWindup: 0.30,
    attackRecover: 0.30,
    attackCooldownBase: 1.0,
    alertSounds: ['posit1', 'posit2', 'posit3'],
    painSound: 'popain',
    deathSounds: ['podth1', 'podth2', 'podth3'],
    attackSound: 'pistol',
    drops: [{ pickup: 'clip', chance: 0.55 }, { pickup: 'health_bonus', chance: 0.15 }],
  },
  imp: {
    spritePrefix: 'TROO',
    hp: 60,
    speed: 1.0,
    walkFrames: ['B', 'C', 'D'],
    painFrame: 'H',
    attackFrame: 'F',
    deathFrames: ['I', 'J', 'K', 'L', 'M'],
    attackType: 'projectile',
    projectileType: 'imp_fireball',
    damage: 0, // carried on projectile
    accuracy: 1.0,
    minApproach: 0.6,
    attackWindup: 0.45,
    attackRecover: 0.40,
    attackCooldownBase: 1.8,
    alertSounds: ['bgsit1', 'bgsit2'],
    painSound: 'popain',
    deathSounds: ['bgdth1', 'bgdth2'],
    attackSound: 'firsht',
    drops: [{ pickup: 'stimpak', chance: 0.35 }, { pickup: 'ammo_box', chance: 0.15 }, { pickup: 'clip', chance: 0.20 }],
  },
  pinky: {
    spritePrefix: 'SARG',
    hp: 80,
    speed: 2.4, // fast charger
    walkFrames: ['B', 'C', 'D'],
    painFrame: 'H',                              // matches Doom info.c S_SARG_PAIN
    attackFrame: 'F',                            // mid-bite frame
    deathFrames: ['I', 'J', 'K', 'L', 'M'],      // S_SARG_DIE1..5
    attackType: 'melee',
    damage: 12,
    accuracy: 1.0,
    meleeRange: 0.9,
    minApproach: 0.0, // pinky wants to be in melee range
    attackWindup: 0.18,
    attackRecover: 0.25,
    attackCooldownBase: 0.7,
    alertSounds: ['sgtsit'],
    painSound: 'dmpain',
    deathSounds: ['sgtdth'],
    attackSound: 'sgtatk',
    drops: [{ pickup: 'medikit', chance: 0.45 }, { pickup: 'stimpak', chance: 0.35 }],
  },
};

// Projectile type config — used by imp fireballs. Spawned dynamically in engine.js,
// rendered alongside enemies in render.js via the shared sprite pipeline.
export const PROJECTILE_TYPES = {
  imp_fireball: {
    spritePrefix: 'BAL1',
    flyFrames: ['A', 'B'],
    explodeFrames: ['C', 'D', 'E'],
    flyFrameTime: 0.10,
    explodeFrameTime: 0.13,
    speed: 6.0,
    damage: 12,
    radius: 0.3,        // collision radius vs player
    spawnAhead: 0.5,    // spawn this far in front of the imp so the fireball doesn't immediately self-hit
    hitSound: 'firxpl',
  },
};

// Pickup types — dropped by enemies, applied to player on contact. `effect` is
// dispatched in engine.js (health vs ammo). Sprite is a single static frame.
export const PICKUP_TYPES = {
  health_bonus: { spriteName: 'BON1A0', effect: 'health', amount: 2,  sound: 'itemup', radius: 0.5 },
  stimpak:      { spriteName: 'STIMA0', effect: 'health', amount: 10, sound: 'itemup', radius: 0.5 },
  medikit:      { spriteName: 'MEDIA0', effect: 'health', amount: 25, sound: 'itemup', radius: 0.5 },
  clip:         { spriteName: 'CLIPA0', effect: 'ammo',   amount: 10, sound: 'itemup', radius: 0.5 },
  ammo_box:     { spriteName: 'AMMOA0', effect: 'ammo',   amount: 50, sound: 'itemup', radius: 0.5 },
};

// Entities placed in the map. `kind: 'enemy'` (default if absent); projectiles +
// pickups get pushed in dynamically (projectiles from imp attacks, pickups from
// enemy deaths or random spawns).
export const ENTITIES = [
  { kind: 'enemy', type: 'zombieman', x: 5.5,  y: 5.5,  angle: 0 },
  { kind: 'enemy', type: 'zombieman', x: 11.5, y: 8.5,  angle: Math.PI },
  { kind: 'enemy', type: 'zombieman', x: 12.0, y: 11.0, angle: -Math.PI / 2 },
  { kind: 'enemy', type: 'imp',       x: 4.0,  y: 12.0, angle: 0 },
  { kind: 'enemy', type: 'pinky',     x: 13.0, y: 3.0,  angle: Math.PI },
];

// Random-spawn type weights — sum doesn't need to be 1 (rollSpawnType normalises).
export const SPAWN_WEIGHTS = {
  zombieman: 0.60,
  imp:       0.25,
  pinky:     0.15,
};

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
