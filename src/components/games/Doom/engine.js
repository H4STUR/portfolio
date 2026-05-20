import { createInput } from './input.js';
import { createRenderer } from './render.js';
import { createSoundSystem } from './sounds.js';
import { loadTextures, loadSprites, getSoundUrls } from './assets.js';
import {
  PLAYER_START, ENTITIES, ENEMY_TYPES, PROJECTILE_TYPES, PICKUP_TYPES, SPAWN_WEIGHTS,
  MAP, MAP_W, MAP_H,
  moveWithCollision, castWallRay, isWallAt,
} from './map.js';
import {
  RENDER_WIDTH, RENDER_HEIGHT, FIXED_DT,
  MOVE_SPEED, ROT_SPEED_KB, MOUSE_SENSITIVITY,
} from './constants.js';

// Map-tile-index -> Freedoom flat name (extracted by scripts/extract-freedoom.py)
const TEX_BY_INDEX = { 1: 'flat5_4', 2: 'flat5_7', 3: 'flat1' };

// Combat tuning — player.
const PISTOL_DAMAGE = 20;
const PISTOL_RANGE = 32;
const PISTOL_FIRE_TIME = 0.18;
const PISTOL_COOLDOWN = 0.40;
const HITSCAN_RADIUS = 0.35;
const PLAYER_MAX_HEALTH = 100;
const PLAYER_START_AMMO = 50;
const PLAYER_PAIN_TIME = 0.35;
const PLAYER_HITBOX_RADIUS = 0.3; // vs projectiles

// Combat tuning — enemy AI globals (per-type details live in ENEMY_TYPES).
const ENEMY_SIGHT_INTERVAL = 0.4;
const ENEMY_PAIN_TIME = 0.18;
const ENEMY_WALK_FRAME_TIME = 0.13;
const ENEMY_DEATH_FRAME_TIME = 0.13; // per frame of the death animation cycle
const ENEMY_ATTACK_COOLDOWN_JITTER = 0.4;

// Pickup + arena-mode constants.
const PLAYER_HEALTH_CAP = 100;
const PLAYER_AMMO_CAP = 200;
const PICKUP_RADIUS = 0.55;          // distance at which player auto-grabs pickups
const SPAWN_MIN_PLAYER_DISTANCE = 5; // tiles — don't spawn enemies in player's face
const SPAWN_POSITION_ATTEMPTS = 25;  // random tile picks before giving up this cycle

// Difficulty scaling — every N kills bumps the enemy cap up and the spawn interval down.
const MAX_ALIVE_ENEMIES_BASE = 6;
const MAX_ALIVE_ENEMIES_CEILING = 12;
const SPAWN_INTERVAL_BASE_MIN = 4.0;
const SPAWN_INTERVAL_BASE_MAX = 7.0;
const SPAWN_INTERVAL_FLOOR_MIN = 1.5;
const SPAWN_INTERVAL_FLOOR_MAX = 3.0;
const SPAWN_RAMP_KILLS_PER_TIER = 10;     // every 10 kills => +1 tier
const SPAWN_RAMP_INTERVAL_PER_TIER = 0.35;// each tier shaves this many seconds off spawn cadence

// Corpses auto-remove after this long so the arena doesn't accumulate forever.
const CORPSE_LINGER_TIME = 8.0;

// Phase 5b: load every enemy type defined in ENEMY_TYPES (not just initial entities)
// since spawn system can introduce any of them at runtime. Plus projectiles, pickups, HUD.
function buildPhase5SpriteList() {
  const names = new Set();
  for (const config of Object.values(ENEMY_TYPES)) {
    const prefix = config.spritePrefix;
    for (const letter of ['A', ...config.walkFrames, config.attackFrame]) {
      for (let r = 1; r <= 8; r++) names.add(`${prefix}${letter}${r}`);
    }
    for (const letter of [config.painFrame, ...config.deathFrames]) {
      for (let r = 0; r <= 8; r++) names.add(`${prefix}${letter}${r}`);
    }
  }
  for (const config of Object.values(PROJECTILE_TYPES)) {
    const prefix = config.spritePrefix;
    for (const letter of [...config.flyFrames, ...config.explodeFrames]) {
      names.add(`${prefix}${letter}0`);
    }
  }
  for (const config of Object.values(PICKUP_TYPES)) {
    names.add(config.spriteName);
  }
  names.add('PISGA0');
  names.add('PISGB0');
  names.add('PISFA0');
  return [...names];
}

const SOUND_NAMES = [
  'pistol',
  // Player
  'oof', 'pldeth',
  // Zombieman
  'posit1', 'posit2', 'posit3',
  'podth1', 'podth2', 'podth3',
  'popain',
  // Imp
  'bgsit1', 'bgsit2',
  'bgdth1', 'bgdth2',
  'firsht', 'firxpl',
  // Pinky
  'sgtsit',
  'sgtdth',
  'sgtatk',
  'dmpain',
  // Pickups
  'itemup',
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function createEngine(container, { width, height }) {
  const canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  canvas.style.imageRendering = 'pixelated';
  canvas.style.cursor = 'crosshair';
  canvas.style.background = '#000';
  container.appendChild(canvas);

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font:14px monospace;background:rgba(0,0,0,0.85);pointer-events:none;';
  overlay.textContent = 'Loading Doom...';
  container.appendChild(overlay);

  const hud = document.createElement('div');
  hud.style.cssText = 'position:absolute;bottom:8px;left:8px;color:#fff;font:11px monospace;background:rgba(0,0,0,0.5);padding:2px 6px;pointer-events:none;';
  hud.textContent = 'CLICK to play  |  WASD move  |  MOUSE look + FIRE  |  ESC release';
  container.appendChild(hud);

  const statusHud = document.createElement('div');
  statusHud.style.cssText = 'position:absolute;bottom:8px;right:8px;color:#fff;font:12px monospace;background:rgba(0,0,0,0.6);padding:3px 8px;pointer-events:none;letter-spacing:1px;';
  container.appendChild(statusHud);

  // Full-screen red overlay that flashes when the player takes damage. Opacity
  // driven from hudState.painTimer in the update loop.
  const painOverlay = document.createElement('div');
  painOverlay.style.cssText = 'position:absolute;inset:0;background:rgba(255,0,0,0);pointer-events:none;transition:background 80ms linear;';
  container.appendChild(painOverlay);

  // Death overlay — shown when health hits 0, hidden by restart().
  const deathOverlay = document.createElement('div');
  deathOverlay.style.cssText = 'position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,0.75);color:#fff;font:bold 28px monospace;letter-spacing:3px;text-align:center;pointer-events:none;';
  deathOverlay.innerHTML = '<div style="color:#f33;font-size:48px;margin-bottom:24px;text-shadow:3px 3px 0 #000;">YOU DIED</div><div style="font-size:16px;">press R to restart</div>';
  container.appendChild(deathOverlay);

  // Pause overlay — shown when pointer lock is released (browser default: Esc)
  // OR before the first click (acts as "CLICK TO PLAY" screen). Volume slider
  // inside is the only pointer-events:auto element so clicks outside the slider
  // pass through to the canvas and re-acquire pointer lock (= resume).
  const pauseOverlay = document.createElement('div');
  pauseOverlay.style.cssText = 'position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,0.65);pointer-events:none;';
  const pauseTitle = document.createElement('div');
  pauseTitle.style.cssText = 'color:#fff;font:bold 36px monospace;letter-spacing:4px;text-shadow:3px 3px 0 #000;margin-bottom:14px;';
  pauseTitle.textContent = 'PAUSED';
  pauseOverlay.appendChild(pauseTitle);
  const pauseHint = document.createElement('div');
  pauseHint.style.cssText = 'color:#bbb;font:12px monospace;margin-bottom:28px;letter-spacing:2px;';
  pauseHint.textContent = 'click to resume';
  pauseOverlay.appendChild(pauseHint);
  const volumePanel = document.createElement('div');
  volumePanel.style.cssText = 'background:rgba(20,20,20,0.9);padding:14px 22px;border:1px solid #444;pointer-events:auto;display:flex;align-items:center;gap:14px;';
  const volumeLabel = document.createElement('span');
  volumeLabel.style.cssText = 'color:#fff;font:11px monospace;letter-spacing:1px;';
  volumeLabel.textContent = 'VOLUME';
  volumePanel.appendChild(volumeLabel);
  const volumeSlider = document.createElement('input');
  volumeSlider.type = 'range';
  volumeSlider.min = '0';
  volumeSlider.max = '100';
  volumeSlider.value = '15';
  volumeSlider.style.cssText = 'width:200px;cursor:pointer;';
  volumePanel.appendChild(volumeSlider);
  const volumeReadout = document.createElement('span');
  volumeReadout.style.cssText = 'color:#fff;font:11px monospace;width:36px;text-align:right;';
  volumeReadout.textContent = '15%';
  volumePanel.appendChild(volumeReadout);
  volumeSlider.addEventListener('input', (e) => {
    const v = parseInt(e.target.value, 10);
    sound.setVolume(v / 100);
    volumeReadout.textContent = v + '%';
  });
  pauseOverlay.appendChild(volumePanel);
  container.appendChild(pauseOverlay);

  const fpsDisplay = document.createElement('div');
  fpsDisplay.style.cssText = 'position:absolute;top:8px;right:8px;color:#0f0;font:12px monospace;background:rgba(0,0,0,0.5);padding:2px 6px;pointer-events:none;';
  fpsDisplay.textContent = '-- fps';
  container.appendChild(fpsDisplay);

  const input = createInput(canvas);
  const renderer = createRenderer(canvas);
  const sound = createSoundSystem();
  const player = { ...PLAYER_START };

  // Combat / HUD state.
  let ammo = PLAYER_START_AMMO;
  let health = PLAYER_MAX_HEALTH;
  let playerDead = false;
  let killCount = 0;
  let spawnTimer = SPAWN_INTERVAL_BASE_MIN;
  const hudState = { pistolState: 'idle', pistolTimer: 0, painTimer: 0 };

  function initEnemy(entity) {
    const config = ENEMY_TYPES[entity.type];
    entity.kind = 'enemy';
    entity.spawnX = entity.x;
    entity.spawnY = entity.y;
    entity.spawnAngle = entity.angle;
    entity.hp = config.hp;
    entity.state = 'idle';            // 'idle' | 'chase' | 'attack' | 'pain' | 'dying'
    entity.stateTimer = 0;
    entity.sightCheckTimer = Math.random() * ENEMY_SIGHT_INTERVAL;
    entity.attackCooldown = 0;
    entity.attackFired = false;
    entity.walkFrame = 0;
    entity.walkTimer = 0;
    entity.deathFrame = 0;
    entity.deathTimer = 0;
  }

  // Capture the initial spawn list — restart() clears ENTITIES (corpses + all)
  // and re-creates these so the arena starts clean again.
  const INITIAL_ENEMY_SPAWNS = ENTITIES
    .filter((e) => (e.kind ?? 'enemy') === 'enemy')
    .map((e) => ({ type: e.type, x: e.x, y: e.y, angle: e.angle }));

  // Initialise the initial enemies in place so the first frame already has them.
  for (const entity of ENTITIES) {
    if ((entity.kind ?? 'enemy') === 'enemy') initEnemy(entity);
  }

  let textures = null;
  let sprites = null;
  let raf = null;
  let running = false;
  let lastTime = 0;
  let accumulator = 0;
  let frameCount = 0;
  let fpsLastUpdate = 0;
  let hasBeenLocked = false; // becomes true after the player's first pointer-lock acquire
  let isPausedNow = false;

  function applyResize(w, h) {
    const targetRatio = RENDER_WIDTH / RENDER_HEIGHT;
    const containerRatio = w / h;
    if (containerRatio > targetRatio) {
      canvas.style.height = h + 'px';
      canvas.style.width = (h * targetRatio) + 'px';
    } else {
      canvas.style.width = w + 'px';
      canvas.style.height = (w / targetRatio) + 'px';
    }
    canvas.style.margin = 'auto';
    canvas.style.position = 'absolute';
    canvas.style.left = '50%';
    canvas.style.top = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
  }

  applyResize(width, height);

  function tryFire() {
    if (hudState.pistolState !== 'idle' || ammo <= 0) return;
    ammo--;
    hudState.pistolState = 'fire';
    hudState.pistolTimer = 0;
    sound.play('pistol');

    const dirX = Math.cos(player.angle);
    const dirY = Math.sin(player.angle);
    const wallDist = castWallRay(player, dirX, dirY);
    let nearestHit = null;
    let nearestDist = Math.min(wallDist, PISTOL_RANGE);

    for (const entity of ENTITIES) {
      if (entity.kind !== 'enemy') continue;
      if (entity.state === 'dying') continue;
      const ex = entity.x - player.x;
      const ey = entity.y - player.y;
      const forwardDot = ex * dirX + ey * dirY;
      if (forwardDot <= 0.1 || forwardDot > nearestDist) continue;
      const perpDot = -ex * dirY + ey * dirX;
      if (Math.abs(perpDot) > HITSCAN_RADIUS) continue;
      nearestHit = entity;
      nearestDist = forwardDot;
    }

    if (nearestHit) damageEntity(nearestHit);
  }

  function damageEntity(entity) {
    if (entity.state === 'dying') return;
    const config = ENEMY_TYPES[entity.type];
    entity.hp -= PISTOL_DAMAGE;
    if (entity.hp <= 0) {
      entity.state = 'dying';
      entity.stateTimer = 0;
      entity.deathFrame = 0;
      entity.deathTimer = 0;
      sound.play(pickRandom(config.deathSounds));
      killCount++;
      const dropType = rollDrop(config.drops);
      if (dropType) spawnPickup(dropType, entity.x, entity.y);
    } else {
      entity.state = 'pain';
      entity.stateTimer = 0;
      sound.play(config.painSound);
    }
  }

  // ---- pickups + drops ----

  function rollDrop(dropTable) {
    if (!dropTable || dropTable.length === 0) return null;
    let roll = Math.random();
    for (const drop of dropTable) {
      if (roll < drop.chance) return drop.pickup;
      roll -= drop.chance;
    }
    return null;
  }

  function spawnPickup(type, x, y) {
    ENTITIES.push({ kind: 'pickup', type, x, y });
  }

  function applyPickup(type) {
    const config = PICKUP_TYPES[type];
    if (!config) return false;
    if (config.effect === 'health') {
      if (health >= PLAYER_HEALTH_CAP) return false; // leave it on the ground for later
      health = Math.min(PLAYER_HEALTH_CAP, health + config.amount);
    } else if (config.effect === 'ammo') {
      if (ammo >= PLAYER_AMMO_CAP) return false;
      ammo = Math.min(PLAYER_AMMO_CAP, ammo + config.amount);
    } else {
      return false;
    }
    sound.play(config.sound);
    return true;
  }

  function checkPickups() {
    for (let i = ENTITIES.length - 1; i >= 0; i--) {
      const e = ENTITIES[i];
      if (e.kind !== 'pickup') continue;
      const dx = player.x - e.x;
      const dy = player.y - e.y;
      if (Math.hypot(dx, dy) > PICKUP_RADIUS) continue;
      if (applyPickup(e.type)) ENTITIES.splice(i, 1);
    }
  }

  // ---- random enemy spawning ----

  function countAliveEnemies() {
    let n = 0;
    for (const e of ENTITIES) {
      if (e.kind === 'enemy' && e.state !== 'dying') n++;
    }
    return n;
  }

  function pickSpawnType() {
    const entries = Object.entries(SPAWN_WEIGHTS);
    const total = entries.reduce((a, [, w]) => a + w, 0);
    let r = Math.random() * total;
    for (const [type, w] of entries) {
      if (r < w) return type;
      r -= w;
    }
    return entries[0][0];
  }

  function findSpawnPosition() {
    for (let i = 0; i < SPAWN_POSITION_ATTEMPTS; i++) {
      const tx = 1 + Math.floor(Math.random() * (MAP_W - 2));
      const ty = 1 + Math.floor(Math.random() * (MAP_H - 2));
      if (MAP[ty][tx] !== 0) continue;
      const x = tx + 0.5;
      const y = ty + 0.5;
      if (Math.hypot(player.x - x, player.y - y) < SPAWN_MIN_PLAYER_DISTANCE) continue;
      return { x, y };
    }
    return null;
  }

  function difficultyTier() {
    return Math.floor(killCount / SPAWN_RAMP_KILLS_PER_TIER);
  }

  function getMaxAliveEnemies() {
    return Math.min(MAX_ALIVE_ENEMIES_BASE + difficultyTier(), MAX_ALIVE_ENEMIES_CEILING);
  }

  function getSpawnInterval() {
    const tier = difficultyTier();
    const shave = tier * SPAWN_RAMP_INTERVAL_PER_TIER;
    const min = Math.max(SPAWN_INTERVAL_FLOOR_MIN, SPAWN_INTERVAL_BASE_MIN - shave);
    const max = Math.max(SPAWN_INTERVAL_FLOOR_MAX, SPAWN_INTERVAL_BASE_MAX - shave);
    return min + Math.random() * (max - min);
  }

  function spawnRandomEnemy() {
    if (countAliveEnemies() >= getMaxAliveEnemies()) return;
    const pos = findSpawnPosition();
    if (!pos) return;
    const type = pickSpawnType();
    const entity = {
      kind: 'enemy',
      type,
      x: pos.x,
      y: pos.y,
      angle: Math.random() * Math.PI * 2,
    };
    initEnemy(entity);
    ENTITIES.push(entity);
  }

  function removeOldCorpses() {
    for (let i = ENTITIES.length - 1; i >= 0; i--) {
      const e = ENTITIES[i];
      if (
        e.kind === 'enemy' &&
        e.state === 'dying' &&
        (e.corpseTimer ?? 0) >= CORPSE_LINGER_TIME
      ) {
        ENTITIES.splice(i, 1);
      }
    }
  }

  // Line-of-sight check: cast a ray from `from` toward `to`; if the wall the ray
  // hits is farther than the target, the target is visible. Used for enemy sight
  // (idle → chase) and to gate enemy shots.
  function canSee(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.001) return true;
    const dirX = dx / dist;
    const dirY = dy / dist;
    return castWallRay(from, dirX, dirY) >= dist;
  }

  function damagePlayer(amount) {
    if (playerDead) return;
    health -= amount;
    hudState.painTimer = PLAYER_PAIN_TIME;
    if (health <= 0) {
      health = 0;
      playerDead = true;
      sound.play('pldeth');
      deathOverlay.style.display = 'flex';
      input.releasePointerLock();
    } else {
      sound.play('oof');
    }
  }

  function spawnProjectile(type, x, y, dirX, dirY) {
    const config = PROJECTILE_TYPES[type];
    ENTITIES.push({
      kind: 'projectile',
      type,
      x: x + dirX * config.spawnAhead,
      y: y + dirY * config.spawnAhead,
      dx: dirX,
      dy: dirY,
      state: 'flying',
      frame: 0,
      frameTimer: 0,
    });
  }

  function fireEnemyAttack(entity, target) {
    const config = ENEMY_TYPES[entity.type];
    sound.play(config.attackSound);
    if (config.attackType === 'hitscan') {
      if (Math.random() > config.accuracy) return;
      if (!canSee(entity, target)) return;
      damagePlayer(config.damage);
    } else if (config.attackType === 'projectile') {
      const dx = target.x - entity.x;
      const dy = target.y - entity.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.001) return;
      spawnProjectile(config.projectileType, entity.x, entity.y, dx / dist, dy / dist);
    } else if (config.attackType === 'melee') {
      const dx = target.x - entity.x;
      const dy = target.y - entity.y;
      if (Math.hypot(dx, dy) <= config.meleeRange) damagePlayer(config.damage);
    }
  }

  function updateProjectile(entity, dt) {
    const config = PROJECTILE_TYPES[entity.type];
    if (entity.state === 'flying') {
      entity.frameTimer += dt;
      if (entity.frameTimer >= config.flyFrameTime) {
        entity.frameTimer = 0;
        entity.frame = (entity.frame + 1) % config.flyFrames.length;
      }
      const newX = entity.x + entity.dx * config.speed * dt;
      const newY = entity.y + entity.dy * config.speed * dt;
      if (isWallAt(newX, newY)) {
        entity.state = 'exploding';
        entity.frame = 0;
        entity.frameTimer = 0;
        sound.play(config.hitSound);
        return;
      }
      const dxP = player.x - newX;
      const dyP = player.y - newY;
      if (!playerDead && Math.hypot(dxP, dyP) < config.radius + PLAYER_HITBOX_RADIUS) {
        damagePlayer(config.damage);
        entity.state = 'exploding';
        entity.frame = 0;
        entity.frameTimer = 0;
        sound.play(config.hitSound);
        return;
      }
      entity.x = newX;
      entity.y = newY;
    } else if (entity.state === 'exploding') {
      entity.frameTimer += dt;
      if (entity.frameTimer >= config.explodeFrameTime) {
        entity.frameTimer = 0;
        entity.frame++;
        if (entity.frame >= config.explodeFrames.length) entity.state = 'dead';
      }
    }
  }

  function updateEnemy(entity, dt) {
    const config = ENEMY_TYPES[entity.type];
    switch (entity.state) {
      case 'idle': {
        entity.sightCheckTimer -= dt;
        if (entity.sightCheckTimer <= 0) {
          entity.sightCheckTimer = ENEMY_SIGHT_INTERVAL;
          if (!playerDead && canSee(entity, player)) {
            entity.state = 'chase';
            entity.stateTimer = 0;
            sound.play(pickRandom(config.alertSounds));
          }
        }
        break;
      }
      case 'chase': {
        if (playerDead) { entity.state = 'idle'; break; }
        const dx = player.x - entity.x;
        const dy = player.y - entity.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.001) entity.angle = Math.atan2(dy, dx);
        if (dist > config.minApproach) {
          const step = config.speed * dt / dist;
          moveWithCollision(entity, dx * step, dy * step);
        }
        entity.walkTimer += dt;
        if (entity.walkTimer >= ENEMY_WALK_FRAME_TIME) {
          entity.walkTimer = 0;
          entity.walkFrame = (entity.walkFrame + 1) % config.walkFrames.length;
        }
        entity.attackCooldown -= dt;
        if (entity.attackCooldown <= 0) {
          // Melee enemies must be in range; ranged enemies just need sight.
          const canFire = config.attackType === 'melee'
            ? (dist <= config.meleeRange + 0.2)
            : canSee(entity, player);
          if (canFire) {
            entity.state = 'attack';
            entity.stateTimer = 0;
            entity.attackFired = false;
          }
        }
        break;
      }
      case 'attack': {
        entity.stateTimer += dt;
        if (!entity.attackFired && entity.stateTimer >= config.attackWindup) {
          entity.attackFired = true;
          fireEnemyAttack(entity, player);
        }
        if (entity.stateTimer >= config.attackWindup + config.attackRecover) {
          entity.state = 'chase';
          entity.stateTimer = 0;
          entity.attackCooldown = config.attackCooldownBase + Math.random() * ENEMY_ATTACK_COOLDOWN_JITTER;
        }
        break;
      }
      case 'pain': {
        entity.stateTimer += dt;
        if (entity.stateTimer >= ENEMY_PAIN_TIME) {
          entity.state = 'chase';
          entity.stateTimer = 0;
          entity.attackCooldown = Math.max(entity.attackCooldown, 0.2);
        }
        break;
      }
      case 'dying': {
        if (entity.deathFrame < config.deathFrames.length - 1) {
          entity.deathTimer += dt;
          if (entity.deathTimer >= ENEMY_DEATH_FRAME_TIME) {
            entity.deathTimer = 0;
            entity.deathFrame++;
          }
        } else {
          // Finished the death sequence — corpse pose. Start linger countdown.
          entity.corpseTimer = (entity.corpseTimer ?? 0) + dt;
        }
        break;
      }
    }
  }

  function updateEntity(entity, dt) {
    if (entity.kind === 'projectile') updateProjectile(entity, dt);
    else updateEnemy(entity, dt);
  }

  function removeDeadProjectiles() {
    for (let i = ENTITIES.length - 1; i >= 0; i--) {
      const e = ENTITIES[i];
      if (e.kind === 'projectile' && e.state === 'dead') ENTITIES.splice(i, 1);
    }
  }

  function restart() {
    player.x = PLAYER_START.x;
    player.y = PLAYER_START.y;
    player.angle = PLAYER_START.angle;
    health = PLAYER_MAX_HEALTH;
    ammo = PLAYER_START_AMMO;
    playerDead = false;
    killCount = 0;
    spawnTimer = SPAWN_INTERVAL_BASE_MIN;
    hudState.pistolState = 'idle';
    hudState.pistolTimer = 0;
    hudState.painTimer = 0;
    deathOverlay.style.display = 'none';
    painOverlay.style.background = 'rgba(255,0,0,0)';
    // Wipe everything (corpses, projectiles, pickups, spawned enemies) and rebuild
    // the arena from INITIAL_ENEMY_SPAWNS.
    ENTITIES.length = 0;
    for (const data of INITIAL_ENEMY_SPAWNS) {
      const entity = { kind: 'enemy', type: data.type, x: data.x, y: data.y, angle: data.angle };
      initEnemy(entity);
      ENTITIES.push(entity);
    }
  }

  function update(dt) {
    // While dead, only run death-animation tickers + in-flight projectiles
    // (so fireballs land instead of freezing mid-air) + watch for restart input.
    if (playerDead) {
      if (input.isDown('KeyR')) restart();
      for (const entity of ENTITIES) {
        if (entity.kind === 'projectile') updateProjectile(entity, dt);
        else if (entity.state === 'dying') updateEnemy(entity, dt);
      }
      removeDeadProjectiles();
      removeOldCorpses();
      if (hudState.painTimer > 0) hudState.painTimer -= dt;
      return;
    }

    // Mouse look (only when pointer is locked)
    if (input.isPointerLocked()) {
      player.angle += input.consumeMouseDX() * MOUSE_SENSITIVITY;
    }
    if (input.isDown('ArrowLeft'))  player.angle -= ROT_SPEED_KB * dt;
    if (input.isDown('ArrowRight')) player.angle += ROT_SPEED_KB * dt;

    const sin = Math.sin(player.angle);
    const cos = Math.cos(player.angle);
    let dx = 0, dy = 0;
    if (input.isDown('KeyW')) { dx += cos; dy += sin; }
    if (input.isDown('KeyS')) { dx -= cos; dy -= sin; }
    if (input.isDown('KeyA')) { dx += sin; dy -= cos; }
    if (input.isDown('KeyD')) { dx -= sin; dy += cos; }

    const mag = Math.hypot(dx, dy);
    if (mag > 0) {
      const scale = MOVE_SPEED * dt / mag;
      moveWithCollision(player, dx * scale, dy * scale);
    }

    if (input.consumeFire()) tryFire();

    // Pistol animation timer
    if (hudState.pistolState === 'fire') {
      hudState.pistolTimer += dt;
      if (hudState.pistolTimer >= PISTOL_FIRE_TIME) hudState.pistolState = 'cooldown';
    } else if (hudState.pistolState === 'cooldown') {
      hudState.pistolTimer += dt;
      if (hudState.pistolTimer >= PISTOL_COOLDOWN) {
        hudState.pistolState = 'idle';
        hudState.pistolTimer = 0;
      }
    }

    if (hudState.painTimer > 0) hudState.painTimer -= dt;

    // Enemy AI + projectile updates (single pass via dispatch on entity.kind)
    for (const entity of ENTITIES) updateEntity(entity, dt);
    removeDeadProjectiles();
    removeOldCorpses();

    // Pickup collisions (after entity updates so death-drop pickups can be grabbed
    // immediately if the player is standing on the corpse).
    checkPickups();

    // Arena-mode random spawning — interval + cap both scale with killCount tier.
    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawnTimer = getSpawnInterval();
      spawnRandomEnemy();
    }
  }

  function frame(time) {
    raf = requestAnimationFrame(frame);
    if (!lastTime) lastTime = time;
    if (!fpsLastUpdate) fpsLastUpdate = time;

    // Determine pause state from pointer-lock + life status. We show the pause
    // overlay both before the first click ("CLICK TO PLAY") and after the user
    // releases pointer lock during play ("PAUSED").
    if (textures) {
      const locked = input.isPointerLocked();
      if (locked) hasBeenLocked = true;
      const shouldPause = !playerDead && !locked;
      if (shouldPause !== isPausedNow) {
        isPausedNow = shouldPause;
        pauseOverlay.style.display = shouldPause ? 'flex' : 'none';
        pauseTitle.textContent = hasBeenLocked ? 'PAUSED' : 'CLICK TO PLAY';
      }
    }

    if (isPausedNow) {
      // Freeze game logic + accumulator (so a long pause doesn't fast-forward
      // when we resume), but keep rendering so the frozen frame stays visible
      // behind the overlay.
      lastTime = time;
      accumulator = 0;
      if (textures) renderer.render(player, textures, ENTITIES, sprites, hudState);
      statusHud.textContent = `HEALTH ${health}   AMMO ${ammo}   KILLS ${killCount}`;
      frameCount++;
      const fpsElapsed = time - fpsLastUpdate;
      if (fpsElapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / fpsElapsed);
        fpsDisplay.textContent = `${fps} fps`;
        frameCount = 0;
        fpsLastUpdate = time;
      }
      return;
    }

    let delta = (time - lastTime) / 1000;
    lastTime = time;
    if (delta > 0.25) delta = 0.25; // cap to avoid spiral-of-death after long pause

    accumulator += delta;
    while (accumulator >= FIXED_DT) {
      update(FIXED_DT);
      accumulator -= FIXED_DT;
    }

    if (textures) renderer.render(player, textures, ENTITIES, sprites, hudState);

    statusHud.textContent = `HEALTH ${health}   AMMO ${ammo}   KILLS ${killCount}`;

    // Pain flash — opacity decays with painTimer.
    const painOpacity = hudState.painTimer > 0
      ? Math.min(0.45, hudState.painTimer / PLAYER_PAIN_TIME * 0.45)
      : 0;
    painOverlay.style.background = painOpacity > 0 ? `rgba(255,0,0,${painOpacity})` : 'rgba(255,0,0,0)';

    // FPS — averaged over a 1s window, updated once per second.
    frameCount++;
    const fpsElapsed = time - fpsLastUpdate;
    if (fpsElapsed >= 1000) {
      const fps = Math.round((frameCount * 1000) / fpsElapsed);
      fpsDisplay.textContent = `${fps} fps`;
      frameCount = 0;
      fpsLastUpdate = time;
    }
  }

  Promise.all([
    loadTextures(Object.values(TEX_BY_INDEX)),
    loadSprites(buildPhase5SpriteList()),
    sound.load(getSoundUrls(SOUND_NAMES)),
  ])
    .then(([loadedTex, loadedSprites]) => {
      textures = {};
      for (const [idx, name] of Object.entries(TEX_BY_INDEX)) {
        textures[idx] = loadedTex[name];
      }
      sprites = loadedSprites;
      overlay.remove();
    })
    .catch((err) => {
      overlay.style.color = '#f55';
      overlay.style.background = 'rgba(0,0,0,0.9)';
      overlay.textContent = 'Asset load failed: ' + err.message;
    });

  return {
    resume() {
      if (running) return;
      running = true;
      lastTime = 0;
      accumulator = 0;
      frameCount = 0;
      fpsLastUpdate = 0;
      raf = requestAnimationFrame(frame);
    },
    pause() {
      if (!running) return;
      running = false;
      if (raf != null) cancelAnimationFrame(raf);
      raf = null;
      input.releasePointerLock();
    },
    resize(w, h) {
      applyResize(w, h);
    },
    dispose() {
      if (raf != null) cancelAnimationFrame(raf);
      raf = null;
      input.dispose();
      sound.dispose();
      canvas.remove();
      overlay.remove();
      hud.remove();
      statusHud.remove();
      fpsDisplay.remove();
      painOverlay.remove();
      deathOverlay.remove();
      pauseOverlay.remove();
    },
  };
}
