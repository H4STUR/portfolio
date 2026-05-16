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

        cascadeIndexRef.current += 1;

        console.log(`[openWindow ALLOWED] ${type} - ${title}`);
        return [
          ...prev,
          {
            id: prev.length,
            type,
            title,
            position: cascadedPosition,
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
