/**
 * Doom — Phase 1: walls + movement + collision + pointer-lock.
 * Implements the Game contract from src/components/games/README.md.
 * Assets sourced from Freedoom (BSD-3-Clause) — see assets/games/doom/COPYING.txt.
 */
import { createEngine } from './engine.js';

export function mount(container, opts) {
  return createEngine(container, opts);
}
