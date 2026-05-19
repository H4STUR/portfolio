/**
 * Smoke-test game module — implements the Game contract from
 * `src/components/games/README.md`. Draws a hue-cycling rectangle.
 * Used to validate the Game.jsx host works end-to-end before real games arrive.
 */
export function mount(container, { width, height }) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.display = 'block';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let raf = null;
  let t = 0;

  function frame() {
    t += 0.02;
    ctx.fillStyle = `hsl(${(t * 50) % 360}, 70%, 50%)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Game.jsx host — contract OK', canvas.width / 2, canvas.height / 2);

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
