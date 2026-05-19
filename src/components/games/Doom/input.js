// Keyboard + pointer-lock + mouse-delta capture for the Doom engine.
// Listeners are document-scoped (otherwise canvas would need focus to receive keys);
// the Game.jsx host already pauses the engine when its window loses focus, so global
// listeners can't interfere with other windows when paused.

export function createInput(canvas) {
  const keys = new Set();
  let mouseDX = 0;
  let pointerLocked = false;

  const onKeyDown = (e) => keys.add(e.code);
  const onKeyUp = (e) => keys.delete(e.code);

  const onClick = () => {
    if (!pointerLocked) canvas.requestPointerLock?.();
  };

  const onMouseMove = (e) => {
    if (pointerLocked) mouseDX += e.movementX || 0;
  };

  const onPointerLockChange = () => {
    pointerLocked = document.pointerLockElement === canvas;
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  canvas.addEventListener('click', onClick);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('pointerlockchange', onPointerLockChange);

  return {
    isDown(code) { return keys.has(code); },
    consumeMouseDX() { const d = mouseDX; mouseDX = 0; return d; },
    isPointerLocked() { return pointerLocked; },
    releasePointerLock() { if (pointerLocked) document.exitPointerLock(); },
    dispose() {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('click', onClick);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      if (pointerLocked) document.exitPointerLock();
      keys.clear();
    },
  };
}
