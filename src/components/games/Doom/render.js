import { RENDER_WIDTH, RENDER_HEIGHT, FOV, CEILING_COLOR, FLOOR_COLOR } from './constants.js';
import { MAP, MAP_W, MAP_H } from './map.js';

const tanHalfFov = Math.tan(FOV / 2);

// Per-channel halve via packed-int trick: mask the low bit of each byte off,
// then >>>1. Faster than per-channel math, exact "darken to 50%" for side walls.
function darken(c) {
  return (((c & 0xFEFEFEFE) >>> 1) | (c & 0xFF000000)) >>> 0;
}

export function createRenderer(canvas) {
  canvas.width = RENDER_WIDTH;
  canvas.height = RENDER_HEIGHT;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(RENDER_WIDTH, RENDER_HEIGHT);
  const screen = new Uint32Array(imageData.data.buffer);
  const zBuffer = new Float32Array(RENDER_WIDTH); // exposed for Phase 2 sprite occlusion

  return {
    zBuffer,
    render(player, textures) {
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

        // Ceiling
        for (let y = 0; y < drawStart; y++) {
          screen[y * RENDER_WIDTH + x] = CEILING_COLOR;
        }

        // Wall — texture-mapped column
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

        // Floor
        for (let y = drawEnd; y < RENDER_HEIGHT; y++) {
          screen[y * RENDER_WIDTH + x] = FLOOR_COLOR;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    },
  };
}
