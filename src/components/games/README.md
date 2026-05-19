# `games/` — heavyweight embedded games

Generic host for advanced games that warrant their own engine code (Doom, DSJ-rewrite, CS). Simple games (Snake, Minesweeper, Paint) keep their dedicated window types — this folder is for engines that need lifecycle plumbing (pause/resume/dispose, pointer-lock, dynamic canvas sizing).

The XP windowing system mounts every game through one shared host: [`WindowTypes/Game.jsx`](../WindowTypes/Game.jsx). The host doesn't know whether the game inside is Canvas2D, WebGL, raycaster, or Three.js — it just enforces the contract below.

## The contract

Each game lives in its own subfolder (`games/Doom/`, `games/CS/`, etc.) and exports a `mount` function from its `index.js`:

```ts
// games/<name>/index.js
export function mount(container: HTMLElement, opts: { width, height }): GameInstance;

interface GameInstance {
  resume(): void;                       // start or continue the render loop
  pause(): void;                        // stop the render loop (window blurred / tab hidden)
  resize(width: number, height: number): void;  // viewport changed
  dispose(): void;                      // window closed — free GPU/audio/DOM/listeners
}
```

The host calls `mount(container, { width, height })` once on window open, then drives `resume / pause / resize / dispose` from window lifecycle events.

## Constraints

- **Framework-agnostic.** Contract has no 2D / 3D / WebGL / Canvas2D leakage. A future game must be implementable in *any* rendering tech without changing the contract.
- **Self-contained canvas.** The game owns and appends its own `<canvas>` to `container` in `mount`. The host doesn't provide one.
- **Lazy-loaded.** Each game module is dynamically imported by the host, so its bundle (and any heavy deps like Three.js) only ships when a user opens that game's window.
- **Multiple instances allowed.** Two windows of the same game can coexist; each `mount` returns an independent instance.
- **`dispose` must be thorough.** Free WebGL contexts, stop `AudioContext`, cancel `requestAnimationFrame`, remove event listeners. After `dispose`, the instance is dead.
- **`pause` stops all ongoing work.** Not just the render loop — also audio playback, timers, and any work that consumes CPU/GPU/network.

## Minimal example

```js
// games/HelloGame/index.js
export function mount(container, { width, height }) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let raf = null;
  let t = 0;

  function frame() {
    t += 0.02;
    ctx.fillStyle = `hsl(${(t * 50) % 360}, 70%, 50%)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    raf = requestAnimationFrame(frame);
  }

  return {
    resume() { if (raf == null) raf = requestAnimationFrame(frame); },
    pause()  { if (raf != null) { cancelAnimationFrame(raf); raf = null; } },
    resize(w, h) { canvas.width = w; canvas.height = h; },
    dispose() {
      if (raf != null) cancelAnimationFrame(raf);
      canvas.remove();
    },
  };
}
```

## Wiring into the desktop

In `folderStructure.json`:

```json
"Doom": { "type": "Game", "template": "Doom", "initialPosition": { "x": 20, "y": 220 } }
```

`type: "Game"` routes through `WindowTypes/Game.jsx`; `template: "Doom"` tells the host to `import('../games/Doom/index.js')`.

## What goes in `shared/`

Empty for now. After Doom ships and CS forces a second concrete use case, common utilities (pointer lock, input, audio manager, asset loader) get extracted here. Don't pre-build it — see [[analyses/portfolio-game-engine-strategy-2026-05-19]] in JARBIS.
