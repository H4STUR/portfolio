// Tiny Web Audio wrapper. Each sound is decoded once into an AudioBuffer at
// startup; play() creates a fresh BufferSource per shot (cheap, GC-friendly).
// The AudioContext starts suspended (browsers require a user gesture to play);
// the first call to play() after a gesture resumes it transparently.
//
// Master gain node sits between every source and the destination so volume can
// be adjusted in real time via setVolume() — used by the in-game volume slider.

export function createSoundSystem({ initialVolume = 0.15 } = {}) {
  let ctx = null;
  let masterGain = null;
  let masterVolume = initialVolume;
  const buffers = {};

  try {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (Ctor) {
      ctx = new Ctor();
      masterGain = ctx.createGain();
      masterGain.gain.value = masterVolume;
      masterGain.connect(ctx.destination);
    }
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
    if (!ctx || !buffers[name] || !masterGain) return;
    if (ctx.state === 'suspended') ctx.resume();
    const source = ctx.createBufferSource();
    source.buffer = buffers[name];
    if (volume !== 1.0) {
      const gain = ctx.createGain();
      gain.gain.value = volume;
      source.connect(gain).connect(masterGain);
    } else {
      source.connect(masterGain);
    }
    source.start();
  }

  function setVolume(v) {
    masterVolume = Math.max(0, Math.min(1, v));
    if (masterGain) masterGain.gain.value = masterVolume;
  }

  function getVolume() {
    return masterVolume;
  }

  function dispose() {
    if (ctx) {
      ctx.close().catch(() => {});
      ctx = null;
      masterGain = null;
    }
  }

  return { load, play, setVolume, getVolume, dispose };
}
