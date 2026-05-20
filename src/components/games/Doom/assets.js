// Eager-glob every wall texture URL at build time so Vite emits proper asset hashes
// and we can look them up by filename without one import per file.
const textureModules = import.meta.glob(
  '../../../assets/games/doom/textures/*.png',
  { eager: true, query: '?url', import: 'default' },
);

const TEXTURE_URLS = {};
for (const [path, url] of Object.entries(textureModules)) {
  const name = path.split('/').pop().replace('.png', '');
  TEXTURE_URLS[name] = url;
}

// All sprite frames (enemies, weapons, projectiles, pickups). Keyed by basename
// (POSSA1, TROOC3, etc.) since Doom's 4-char prefix convention makes names unique
// across folders. Loader only decodes the ones requested per phase.
const spriteModules = import.meta.glob(
  '../../../assets/games/doom/sprites/**/*.png',
  { eager: true, query: '?url', import: 'default' },
);

const SPRITE_URLS = {};
for (const [path, url] of Object.entries(spriteModules)) {
  const name = path.split('/').pop().replace('.png', '');
  SPRITE_URLS[name] = url;
}

const soundModules = import.meta.glob(
  '../../../assets/games/doom/sounds/*.wav',
  { eager: true, query: '?url', import: 'default' },
);

const SOUND_URLS = {};
for (const [path, url] of Object.entries(soundModules)) {
  const name = path.split('/').pop().replace('.wav', '');
  SOUND_URLS[name] = url;
}

export function getSoundUrls(names) {
  const result = {};
  for (const name of names) {
    if (SOUND_URLS[name]) result[name] = SOUND_URLS[name];
  }
  return result;
}

function loadImageToBuffer(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, img.width, img.height);
      // Copy the byte buffer so the canvas can be GC'd; view as Uint32 for fast lookup.
      const pixels = new Uint32Array(data.data.buffer.slice(0));
      resolve({ width: img.width, height: img.height, pixels });
    };
    img.onerror = () => reject(new Error(`Failed to load texture: ${url}`));
    img.src = url;
  });
}

export async function loadTextures(names) {
  const result = {};
  await Promise.all(names.map(async (name) => {
    const url = TEXTURE_URLS[name];
    if (!url) throw new Error(`Texture not found in glob: ${name}`);
    result[name] = await loadImageToBuffer(url);
  }));
  return result;
}

// Tolerant of missing names — silently skips so callers can ask for
// "all variants we might need" without breaking when Freedoom doesn't
// happen to have a particular rotation/frame.
export async function loadSprites(names) {
  const result = {};
  await Promise.all(names.map(async (name) => {
    const url = SPRITE_URLS[name];
    if (!url) return;
    result[name] = await loadImageToBuffer(url);
  }));
  return result;
}
