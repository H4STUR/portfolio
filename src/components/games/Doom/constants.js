// Internal render resolution (chunky pixels — CSS scales the canvas up).
// Authentic Doom feel + cheap render cost (64,000 columns / sec at 60fps).
export const RENDER_WIDTH = 320;
export const RENDER_HEIGHT = 200;

// 60° horizontal FOV — comfortable, close to original Doom's effective HFOV.
export const FOV = Math.PI / 3;

// Fixed update timestep — 60Hz. Render runs at RAF (vsynced).
export const FIXED_DT = 1 / 60;

export const MOVE_SPEED = 3.0;            // world tiles per second
export const ROT_SPEED_KB = 2.5;          // radians per second (arrow-key fallback)
export const MOUSE_SENSITIVITY = 0.0025;  // radians per pixel of pointer delta
export const PLAYER_RADIUS = 0.2;         // AABB half-extent in world units

// Pack RGBA into uint32 little-endian (matches ImageData byte order on x86/ARM).
export const rgba = (r, g, b, a = 255) =>
  (((a << 24) >>> 0) | (b << 16) | (g << 8) | r) >>> 0;

export const CEILING_COLOR = rgba(56, 56, 56);
export const FLOOR_COLOR = rgba(96, 96, 96);
