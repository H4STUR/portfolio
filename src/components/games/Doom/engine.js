import { createInput } from './input.js';
import { createRenderer } from './render.js';
import { loadTextures } from './assets.js';
import { PLAYER_START, moveWithCollision } from './map.js';
import {
  RENDER_WIDTH, RENDER_HEIGHT, FIXED_DT,
  MOVE_SPEED, ROT_SPEED_KB, MOUSE_SENSITIVITY,
} from './constants.js';

// Map-tile-index -> Freedoom flat name (extracted by scripts/extract-freedoom.py)
const TEX_BY_INDEX = { 1: 'flat5_4', 2: 'flat5_7', 3: 'flat1' };

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
  hud.textContent = 'CLICK to play  |  WASD move  |  MOUSE look  |  ESC release';
  container.appendChild(hud);

  const input = createInput(canvas);
  const renderer = createRenderer(canvas);
  const player = { ...PLAYER_START };
  let textures = null;
  let raf = null;
  let running = false;
  let lastTime = 0;
  let accumulator = 0;

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
  }

  function frame(time) {
    raf = requestAnimationFrame(frame);
    if (!lastTime) lastTime = time;
    let delta = (time - lastTime) / 1000;
    lastTime = time;
    if (delta > 0.25) delta = 0.25; // cap to avoid spiral-of-death after long pause

    accumulator += delta;
    while (accumulator >= FIXED_DT) {
      update(FIXED_DT);
      accumulator -= FIXED_DT;
    }

    if (textures) renderer.render(player, textures);
  }

  loadTextures(Object.values(TEX_BY_INDEX))
    .then((loaded) => {
      textures = {};
      for (const [idx, name] of Object.entries(TEX_BY_INDEX)) {
        textures[idx] = loaded[name];
      }
      overlay.remove();
    })
    .catch((err) => {
      overlay.style.color = '#f55';
      overlay.style.background = 'rgba(0,0,0,0.9)';
      overlay.textContent = 'Texture load failed: ' + err.message;
    });

  return {
    resume() {
      if (running) return;
      running = true;
      lastTime = 0;
      accumulator = 0;
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
      canvas.remove();
      overlay.remove();
      hud.remove();
    },
  };
}
