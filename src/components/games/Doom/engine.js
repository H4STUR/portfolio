import { createInput } from './input.js';
import { createRenderer } from './render.js';
import { createSoundSystem } from './sounds.js';
import { loadTextures, loadSprites, getSoundUrls } from './assets.js';
import { PLAYER_START, ENTITIES, ENEMY_TYPES, moveWithCollision, castWallRay } from './map.js';
import {
  RENDER_WIDTH, RENDER_HEIGHT, FIXED_DT,
  MOVE_SPEED, ROT_SPEED_KB, MOUSE_SENSITIVITY,
} from './constants.js';

// Map-tile-index -> Freedoom flat name (extracted by scripts/extract-freedoom.py)
const TEX_BY_INDEX = { 1: 'flat5_4', 2: 'flat5_7', 3: 'flat1' };

// Combat tuning.
const PISTOL_DAMAGE = 20;       // 2-shot kill on 20-hp zombieman (matches Doom's pistol behaviour)
const PISTOL_RANGE = 32;        // tiles
const PISTOL_FIRE_TIME = 0.18;  // seconds the muzzle-flash + recoil sprite is visible
const PISTOL_COOLDOWN = 0.40;   // seconds between shots (matches Doom's ~25 tics)
const HITSCAN_RADIUS = 0.35;    // entity hitbox radius (world units)

// Doom zombieman death sequence (per id's info.c):
//   H = pain (would be used for non-fatal hits — Phase 4)
//   I, J, K = falling sequence
//   L = settled corpse (final, stays forever)
// Include H as the first "you just got shot" reaction frame even though Doom would
// only use it for non-fatal hits — it's a nice transition before the slump.
const DEATH_FRAMES = ['H', 'I', 'J', 'K', 'L'];
const DEATH_FRAME_TIME = 0.13;  // seconds per frame — 5 frames × 0.13s = 0.65s total

// Phase 3: load idle (frame A × 8 rotations) + pain (G0) + death frames (H-K, single).
// Walk frames (B-D) and attack (E) come in Phase 4 with AI.
function buildPhase3SpriteList() {
  const names = new Set();
  for (const entity of ENTITIES) {
    const prefix = ENEMY_TYPES[entity.type].spritePrefix;
    for (let r = 1; r <= 8; r++) names.add(`${prefix}A${r}`);
    for (const f of DEATH_FRAMES) names.add(`${prefix}${f}0`);
  }
  // Pistol HUD frames + muzzle flash.
  names.add('PISGA0');
  names.add('PISGB0');
  names.add('PISFA0');
  return [...names];
}

const SOUND_NAMES = ['pistol', 'podth1', 'podth2', 'podth3'];

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

  const fpsDisplay = document.createElement('div');
  fpsDisplay.style.cssText = 'position:absolute;top:8px;right:8px;color:#0f0;font:12px monospace;background:rgba(0,0,0,0.5);padding:2px 6px;pointer-events:none;';
  fpsDisplay.textContent = '-- fps';
  container.appendChild(fpsDisplay);

  const input = createInput(canvas);
  const renderer = createRenderer(canvas);
  const sound = createSoundSystem();
  const player = { ...PLAYER_START };

  // Combat / HUD state. Entities get hp + death-state fields on first load.
  let ammo = 50;
  let health = 100;
  const hudState = { pistolState: 'idle', pistolTimer: 0 }; // passed by ref to renderer

  for (const entity of ENTITIES) {
    entity.hp = 20;
    entity.dying = false;
    entity.deathTimer = 0;
    entity.deathFrame = 0;
  }

  let textures = null;
  let sprites = null;
  let raf = null;
  let running = false;
  let lastTime = 0;
  let accumulator = 0;
  let frameCount = 0;
  let fpsLastUpdate = 0;

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

    // Hitscan: cast ray straight ahead, stop at nearest wall, check entities in radius.
    const dirX = Math.cos(player.angle);
    const dirY = Math.sin(player.angle);
    const wallDist = castWallRay(player, dirX, dirY);
    let nearestHit = null;
    let nearestDist = Math.min(wallDist, PISTOL_RANGE);

    for (const entity of ENTITIES) {
      if (entity.dying) continue;
      const ex = entity.x - player.x;
      const ey = entity.y - player.y;
      const forwardDot = ex * dirX + ey * dirY;
      if (forwardDot <= 0.1 || forwardDot > nearestDist) continue;
      // Perpendicular distance from ray (right-handed cross product magnitude).
      const perpDot = -ex * dirY + ey * dirX;
      if (Math.abs(perpDot) > HITSCAN_RADIUS) continue;
      nearestHit = entity;
      nearestDist = forwardDot;
    }

    if (nearestHit) damageEntity(nearestHit);
  }

  function damageEntity(entity) {
    entity.hp -= PISTOL_DAMAGE;
    if (entity.hp <= 0 && !entity.dying) {
      entity.dying = true;
      entity.deathTimer = 0;
      entity.deathFrame = 0;
      const variant = 1 + Math.floor(Math.random() * 3); // podth1/2/3
      sound.play(`podth${variant}`);
    }
  }

  function update(dt) {
    // Mouse look (only when pointer is locked)
    if (input.isPointerLocked()) {
      player.angle += input.consumeMouseDX() * MOUSE_SENSITIVITY;
    }
    // Keyboard rotation fallback (arrow keys always work)
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

    // Fire trigger (consumed = at most one shot per click event)
    if (input.consumeFire()) tryFire();

    // Pistol animation timer
    if (hudState.pistolState === 'fire') {
      hudState.pistolTimer += dt;
      if (hudState.pistolTimer >= PISTOL_FIRE_TIME) {
        hudState.pistolState = 'cooldown';
      }
    } else if (hudState.pistolState === 'cooldown') {
      hudState.pistolTimer += dt;
      if (hudState.pistolTimer >= PISTOL_COOLDOWN) {
        hudState.pistolState = 'idle';
        hudState.pistolTimer = 0;
      }
    }

    // Enemy death animation timer
    for (const entity of ENTITIES) {
      if (entity.dying && entity.deathFrame < DEATH_FRAMES.length - 1) {
        entity.deathTimer += dt;
        if (entity.deathTimer >= DEATH_FRAME_TIME) {
          entity.deathTimer = 0;
          entity.deathFrame++;
        }
      }
    }
  }

  function frame(time) {
    raf = requestAnimationFrame(frame);
    if (!lastTime) lastTime = time;
    if (!fpsLastUpdate) fpsLastUpdate = time;
    let delta = (time - lastTime) / 1000;
    lastTime = time;
    if (delta > 0.25) delta = 0.25; // cap to avoid spiral-of-death after long pause

    accumulator += delta;
    while (accumulator >= FIXED_DT) {
      update(FIXED_DT);
      accumulator -= FIXED_DT;
    }

    if (textures) renderer.render(player, textures, ENTITIES, sprites, hudState, DEATH_FRAMES);

    statusHud.textContent = `HEALTH ${health}   AMMO ${ammo}`;

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
    loadSprites(buildPhase3SpriteList()),
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
    },
  };
}
