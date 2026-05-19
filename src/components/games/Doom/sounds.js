// Tiny Web Audio wrapper. Each sound is decoded once into an AudioBuffer at
// startup; play() creates a fresh BufferSource per shot (cheap, GC-friendly).
// The AudioContext starts suspended (browsers require a user gesture to play);
// the first call to play() after a gesture resumes it transparently.

export function createSoundSystem() {
  let ctx = null;
  const buffers = {};

  try {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (Ctor) ctx = new Ctor();
  } catch {
    ctx = null;
  }

  async function load(urlsByName) {
    if (!ctx) return;
    await Promise.all(Object.entries(urlsByName).map(async ([name, url]) => {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      try {
        buffers[name] = await ctx.decodeAudioData(arrayBuffer);
      } catch {
        // ignore individual decode failures — game still runs without that sound
      }
    }));
  }

  function play(name, volume = 1.0) {
    if (!ctx || !buffers[name]) return;
    if (ctx.state === 'suspended') ctx.resume();
    const source = ctx.createBufferSource();
    source.buffer = buffers[name];
    if (volume !== 1.0) {
      const gain = ctx.createGain();
      gain.gain.value = volume;
      source.connect(gain).connect(ctx.destination);
    } else {
      source.connect(ctx.destination);
    }
    source.start();
  }

  function dispose() {
    if (ctx) {
      ctx.close().catch(() => {});
      ctx = null;
    }
  }

  return { load, play, dispose };
}
