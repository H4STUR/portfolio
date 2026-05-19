import { RENDER_WIDTH, RENDER_HEIGHT, FOV, CEILING_COLOR, FLOOR_COLOR } from './constants.js';
import { MAP, MAP_W, MAP_H, ENEMY_TYPES } from './map.js';

const tanHalfFov = Math.tan(FOV / 2);
const TAU = Math.PI * 2;

// Doom convention: a sprite's pixel height of 64 corresponds to 1 world tile of
// vertical extent. We use this to scale sprites in world units so a short corpse
// renders shorter than a tall standing enemy (instead of both being "1 tile tall").
const SPRITE_PIXELS_PER_TILE = 64;

// Per-channel halve via packed-int trick: mask the low bit of each byte off,
// then >>>1. Faster than per-channel math, exact "darken to 50%" for side walls.
function darken(c) {
  return (((c & 0xFEFEFEFE) >>> 1) | (c & 0xFF000000)) >>> 0;
}

// Doom 8-rotation sprite picker. Rotation 1 = enemy facing camera (we see its front),
// rotation 5 = enemy facing away (we see its back), 3 = camera at enemy's right side,
// 7 = camera at enemy's left side. Each bucket spans 45°, centered on its rotation.
// Sign convention: subtract atan2(entity->player) from entity.angle (NOT the reverse) —
// the rotation number indexes the side WE see, which is opposite the camera-from-entity
// direction. Got this wrong initially; verified visually against POSSA3/POSSA7 sprites.
function pickRotation(entity, player) {
  const dx = player.x - entity.x;
  const dy = player.y - entity.y;
  let diff = entity.angle - Math.atan2(dy, dx);
  diff = ((diff % TAU) + TAU) % TAU; // normalize to [0, 2π)
  return (Math.floor((diff + Math.PI / 8) / (Math.PI / 4)) % 8) + 1;
}

export function createRenderer(canvas) {
  canvas.width = RENDER_WIDTH;
  canvas.height = RENDER_HEIGHT;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(RENDER_WIDTH, RENDER_HEIGHT);
  const screen = new Uint32Array(imageData.data.buffer);
  const zBuffer = new Float32Array(RENDER_WIDTH); // exposed for Phase 2 sprite occlusion

  // Sort buffer reused across frames to avoid per-frame allocations.
  const spriteOrder = [];

  // Direct screen blit (no scaling). For HUD overlays — pistol sprite, muzzle flash.
  function blitSprite(sprite, dx, dy) {
    for (let y = 0; y < sprite.height; y++) {
      const sy = dy + y;
      if (sy < 0 || sy >= RENDER_HEIGHT) continue;
      const rowOff = y * sprite.width;
      const screenOff = sy * RENDER_WIDTH;
      for (let x = 0; x < sprite.width; x++) {
        const sx = dx + x;
        if (sx < 0 || sx >= RENDER_WIDTH) continue;
        const color = sprite.pixels[rowOff + x];
        if ((color & 0xFF000000) === 0) continue;
        screen[screenOff + sx] = color;
      }
    }
  }

  function renderHud(hudState, sprites) {
    const pistolName = hudState.pistolState === 'fire' ? 'PISGB0' : 'PISGA0';
    const pistol = sprites[pistolName];
    if (!pistol) return;
    // Anchor bottom-center.
    const px = Math.floor((RENDER_WIDTH - pistol.width) / 2);
    const py = RENDER_HEIGHT - pistol.height;
    blitSprite(pistol, px, py);
    // Muzzle flash sits on top of the pistol, near the barrel, while firing.
    if (hudState.pistolState === 'fire') {
      const flash = sprites['PISFA0'];
      if (flash) {
        const fx = px + Math.floor((pistol.width - flash.width) / 2);
        const fy = py - Math.floor(flash.height / 2);
        blitSprite(flash, fx, fy);
      }
    }
  }

  function renderSprites(player, entities, sprites, deathFrames) {
    const dirX = Math.cos(player.angle);
    const dirY = Math.sin(player.angle);
    const planeX = -dirY * tanHalfFov;
    const planeY = dirX * tanHalfFov;
    const invDet = 1.0 / (planeX * dirY - dirX * planeY);

    // Sort far -> near so closer sprites overdraw farther ones (sprites overdraw
    // freely; walls still clip via per-column Z-buffer check below).
    spriteOrder.length = 0;
    for (const e of entities) {
      const dx = e.x - player.x;
      const dy = e.y - player.y;
      spriteOrder.push({ entity: e, distSq: dx * dx + dy * dy });
    }
    spriteOrder.sort((a, b) => b.distSq - a.distSq);

    for (const { entity } of spriteOrder) {
      const spriteX = entity.x - player.x;
      const spriteY = entity.y - player.y;
      const transformX = invDet * (dirY * spriteX - dirX * spriteY);
      const transformY = invDet * (-planeY * spriteX + planeX * spriteY);
      if (transformY <= 0.05) continue; // behind camera or too close

      const prefix = ENEMY_TYPES[entity.type].spritePrefix;
      let spriteName;
      if (entity.dying) {
        // Death frames are single-orientation (Doom convention: corpses don't rotate).
        const letter = deathFrames[entity.deathFrame] || deathFrames[deathFrames.length - 1];
        spriteName = `${prefix}${letter}0`;
      } else {
        const rotation = pickRotation(entity, player);
        spriteName = `${prefix}A${rotation}`;
      }
      const sprite = sprites[spriteName];
      if (!sprite) continue;

      const spriteScreenX = Math.floor((RENDER_WIDTH / 2) * (1 + transformX / transformY));

      // Scale sprite by its own pixel size (Doom: 64 px = 1 tile world height).
      // This way a 30-px corpse renders shorter than a 57-px standing zombieman.
      const scale = RENDER_HEIGHT / (transformY * SPRITE_PIXELS_PER_TILE);
      const spriteHeight = Math.abs(Math.floor(sprite.height * scale));
      const spriteWidth = Math.abs(Math.floor(sprite.width * scale));

      // Floor anchor: sprite bottom sits on the perspective floor line at this depth.
      // Floor line = horizon (RENDER_HEIGHT/2) + half the 1-tile-wall lineHeight at this depth.
      const floorY = Math.floor(RENDER_HEIGHT / 2 + RENDER_HEIGHT / (2 * transformY));
      const spriteTop = floorY - spriteHeight;
      const drawStartY = Math.max(0, spriteTop);
      const drawEndY = Math.min(RENDER_HEIGHT, floorY);

      const drawStartX = Math.floor(-spriteWidth / 2 + spriteScreenX);
      const drawEndX = Math.floor(spriteWidth / 2 + spriteScreenX);
      const xStart = Math.max(0, drawStartX);
      const xEnd = Math.min(RENDER_WIDTH, drawEndX);

      for (let x = xStart; x < xEnd; x++) {
        if (transformY >= zBuffer[x]) continue; // wall in front of this sprite column

        const texX = Math.floor((x - drawStartX) * sprite.width / spriteWidth);
        if (texX < 0 || texX >= sprite.width) continue;

        for (let y = drawStartY; y < drawEndY; y++) {
          const texY = Math.floor((y - spriteTop) * sprite.height / spriteHeight);
          if (texY < 0 || texY >= sprite.height) continue;
          const color = sprite.pixels[texY * sprite.width + texX];
          if ((color & 0xFF000000) === 0) continue; // alpha == 0: transparent
          screen[y * RENDER_WIDTH + x] = color;
        }
      }
    }
  }

  return {
    zBuffer,
    render(player, textures, entities, sprites, hudState, deathFrames) {
      // Pre-fill ceiling (top half) + floor (bottom half) in one shot.
      // SIMD-backed memset, ~10x faster than per-column loops + cache-friendly.
      // The wall pass below overdraws the wall slice; non-wall pixels keep their fill colour.
      const horizon = RENDER_WIDTH * (RENDER_HEIGHT >> 1);
      screen.fill(CEILING_COLOR, 0, horizon);
      screen.fill(FLOOR_COLOR, horizon);

      const dirX = Math.cos(player.angle);
      const dirY = Math.sin(player.angle);
      const planeX = -dirY * tanHalfFov;
      const planeY = dirX * tanHalfFov;

      for (let x = 0; x < RENDER_WIDTH; x++) {
        const cameraX = 2 * x / RENDER_WIDTH - 1;
        const rayDirX = dirX + planeX * cameraX;
        const rayDirY = dirY + planeY * cameraX;

        let mapX = Math.floor(player.x);
        let mapY = Math.floor(player.y);
        const deltaDistX = rayDirX === 0 ? 1e30 : Math.abs(1 / rayDirX);
        const deltaDistY = rayDirY === 0 ? 1e30 : Math.abs(1 / rayDirY);

        let stepX, sideDistX, stepY, sideDistY;
        if (rayDirX < 0) { stepX = -1; sideDistX = (player.x - mapX) * deltaDistX; }
        else             { stepX =  1; sideDistX = (mapX + 1.0 - player.x) * deltaDistX; }
        if (rayDirY < 0) { stepY = -1; sideDistY = (player.y - mapY) * deltaDistY; }
        else             { stepY =  1; sideDistY = (mapY + 1.0 - player.y) * deltaDistY; }

        // DDA step until we hit a wall (or fall off the map — treated as wall)
        let hit = 0, side = 0;
        for (let i = 0; i < 64; i++) {
          if (sideDistX < sideDistY) {
            sideDistX += deltaDistX;
            mapX += stepX;
            side = 0;
          } else {
            sideDistY += deltaDistY;
            mapY += stepY;
            side = 1;
          }
          if (mapX < 0 || mapX >= MAP_W || mapY < 0 || mapY >= MAP_H) { hit = 1; break; }
          const t = MAP[mapY][mapX];
          if (t > 0) { hit = t; break; }
        }

        const perpDist = (side === 0)
          ? (mapX - player.x + (1 - stepX) / 2) / rayDirX
          : (mapY - player.y + (1 - stepY) / 2) / rayDirY;

        zBuffer[x] = perpDist;

        const lineHeight = Math.floor(RENDER_HEIGHT / perpDist);
        const drawStart = Math.max(0, Math.floor(-lineHeight / 2 + RENDER_HEIGHT / 2));
        const drawEnd = Math.min(RENDER_HEIGHT, Math.floor(lineHeight / 2 + RENDER_HEIGHT / 2));

        // Wall — texture-mapped column. Ceiling + floor already pre-filled above.
        const tex = textures[hit] || textures[1];
        let wallX = (side === 0)
          ? player.y + perpDist * rayDirY
          : player.x + perpDist * rayDirX;
        wallX -= Math.floor(wallX);
        let texX = Math.floor(wallX * tex.width);
        if (side === 0 && rayDirX > 0) texX = tex.width - texX - 1;
        if (side === 1 && rayDirY < 0) texX = tex.width - texX - 1;

        const texHeightMask = tex.height - 1; // assumes pow-of-2 height (Doom flats are 64x64)
        const step = tex.height / lineHeight;
        let texPos = (drawStart - RENDER_HEIGHT / 2 + lineHeight / 2) * step;
        for (let y = drawStart; y < drawEnd; y++) {
          const texY = Math.floor(texPos) & texHeightMask;
          texPos += step;
          let color = tex.pixels[texY * tex.width + texX];
          if (side === 1) color = darken(color);
          screen[y * RENDER_WIDTH + x] = color;
        }
      }

      // Sprite pass — walls + Z-buffer already populated by the column loop above.
      if (entities && sprites) renderSprites(player, entities, sprites, deathFrames);

      // HUD overlay (pistol + muzzle flash) — drawn last so it sits on top of everything.
      if (hudState && sprites) renderHud(hudState, sprites);

      ctx.putImageData(imageData, 0, 0);
    },
  };
}
