// Keyboard + pointer-lock + mouse-delta capture for the Doom engine.
// Listeners are document-scoped (otherwise canvas would need focus to receive keys);
// the Game.jsx host already pauses the engine when its window loses focus, so global
// listeners can't interfere with other windows when paused.

export function createInput(canvas) {
  const keys = new Set();
  let mouseDX = 0;
  let pointerLocked = false;
  let firePressed = false; // set on mousedown when locked, cleared by consumeFire()

  const onKeyDown = (e) => keys.add(e.code);
  const onKeyUp = (e) => keys.delete(e.code);

  const onClick = () => {
    if (!pointerLocked) canvas.requestPointerLock?.();
  };

  // Use mousedown rather than click so fire feels responsive (no wait for mouseup).
  // Click handler still owns pointer-lock acquisition — the two don't conflict
  // because firePressed only sets when ALREADY locked.
  const onMouseDown = (e) => {
    if (pointerLocked && e.button === 0) firePressed = true;
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
  canvas.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('pointerlockchange', onPointerLockChange);

  return {
    isDown(code) { return keys.has(code); },
    consumeMouseDX() { const d = mouseDX; mouseDX = 0; return d; },
    consumeFire() { const f = firePressed; firePressed = false; return f; },
    isPointerLocked() { return pointerLocked; },
    releasePointerLock() { if (pointerLocked) document.exitPointerLock(); },
    dispose() {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      if (pointerLocked) document.exitPointerLock();
      keys.clear();
    },
  };
}
