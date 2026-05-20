import { useEffect, useRef, useState } from 'react';
import Window from '../Window';

/**
 * Generic host for heavyweight embedded games (Doom, CS, DSJ-rewrite).
 * The game module at `games/<template>/index.js` must export `mount` per the
 * contract documented in `src/components/games/README.md`.
 */
const Game = ({ id, title, onClose, position, template, initialSize, isActive = true }) => {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  const [error, setError] = useState(null);
  const [docHidden, setDocHidden] = useState(typeof document !== 'undefined' && document.hidden);

  const size = initialSize || { width: 640, height: 480 };

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    import(`../games/${template}/index.js`)
      .then((mod) => {
        if (cancelled || !container) return;
        if (typeof mod.mount !== 'function') {
          setError(`games/${template}/index.js does not export mount()`);
          return;
        }
        const rect = container.getBoundingClientRect();
        instanceRef.current = mod.mount(container, {
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        });
        instanceRef.current?.resume?.();
      })
      .catch((err) => {
        if (!cancelled) setError(`Failed to load games/${template}: ${err.message}`);
      });

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || !instanceRef.current) return;
      const { width, height } = entry.contentRect;
      instanceRef.current.resize?.(Math.floor(width), Math.floor(height));
    });
    ro.observe(container);

    const onVisibility = () => setDocHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      instanceRef.current?.dispose?.();
      instanceRef.current = null;
    };
  }, [template]);

  // Single source of truth for pause/resume: game runs iff active AND tab visible.
  useEffect(() => {
    if (!instanceRef.current) return;
    if (isActive && !docHidden) instanceRef.current.resume?.();
    else instanceRef.current.pause?.();
  }, [isActive, docHidden]);

  return (
    <Window
      id={id}
      title={title}
      onClose={onClose}
      position={position}
      size={size}
      className="window game-window"
    >
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#000' }}
      >
        {error && (
          <div style={{ color: '#f55', fontFamily: 'monospace', padding: 12 }}>
            {error}
          </div>
        )}
      </div>
    </Window>
  );
};

export default Game;
