import { useState, useRef, useCallback } from 'react';

export const useWindows = () => {
  const [windows, setWindows] = useState([]);
  const cascadeIndexRef = useRef(0);

  const openWindow = useCallback(
    (type, title, template, icons = [], position = { x: 100, y: 100 }, initialSize = null) => {
      setWindows((prev) => {
        const alreadyOpen = prev.some((w) => w.type === type && w.title === title);
        if (alreadyOpen) {
          console.log(`[openWindow BLOCKED] ${type} - ${title}`);
          return prev;
        }

        const cascadeOffset = 30;
        const cascadeStep = cascadeIndexRef.current % 5;
        const cascadedPosition = prev.length > 0
          ? { x: position.x + cascadeStep * cascadeOffset, y: position.y + cascadeStep * cascadeOffset }
          : position;

        // Clamp into the viewport so big windows opened from bottom/right
        // icons don't appear half off-screen. Icon position is used as a hint;
        // window slides back into view if it would overflow.
        const w = initialSize?.width || 600;
        const h = initialSize?.height || 400;
        const maxX = Math.max(0, window.innerWidth - w);
        const maxY = Math.max(0, window.innerHeight - h);
        const finalPosition = {
          x: Math.min(Math.max(0, cascadedPosition.x), maxX),
          y: Math.min(Math.max(0, cascadedPosition.y), maxY),
        };

        cascadeIndexRef.current += 1;

        console.log(`[openWindow ALLOWED] ${type} - ${title}`);
        return [
          ...prev,
          {
            id: prev.length,
            type,
            title,
            position: finalPosition,
            template,
            icons,
            ...(initialSize && { initialSize }),
          },
        ];
      });
    },
    []
  );

  const closeWindow = useCallback((id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback((id) => {
    setWindows((prev) => {
      if (prev.length === 0 || prev[prev.length - 1].id === id) return prev;
      const target = prev.find((w) => w.id === id);
      if (!target) return prev;
      return [...prev.filter((w) => w.id !== id), target];
    });
  }, []);

  return { windows, openWindow, closeWindow, focusWindow };
};
