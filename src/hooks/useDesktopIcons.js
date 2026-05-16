import { useState, useEffect, useCallback } from 'react';
import folderStructure from '../components/folderStructure.json';

const CELL_SIZE = 100;

const parseFolderStructure = (items) => {
  const icons = [];
  Object.entries(items).forEach(([key, value]) => {
    if (value.type) {
      icons.push({
        id: `${key}-${Math.random()}`,
        type: value.type,
        title: value.title || key,
        initialPosition: value.initialPosition || { x: 0, y: 0 },
        initialSize: value.initialSize || null,
        template: value.template || '',
        imageOverride: value.image || null,
        icons: value.icons ? parseFolderStructure(value.icons) : [],
      });
    }
  });
  return icons;
};

export const useDesktopIcons = () => {
  const [desktopIcons, setDesktopIcons] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const desktopItems = folderStructure.C.Users.Danio.Desktop;
      setDesktopIcons(parseFolderStructure(desktopItems));
    } catch (err) {
      console.error('Error loading folder structure:', err);
      setError(err);
    }
  }, []);

  const isPositionOccupied = useCallback((excludeId, x, y) => {
    return desktopIcons.some((icon) => {
      if (icon.id === excludeId) return false;
      const iconGridX = Math.round(icon.initialPosition.x / CELL_SIZE) * CELL_SIZE;
      const iconGridY = Math.round(icon.initialPosition.y / CELL_SIZE) * CELL_SIZE;
      return iconGridX === x && iconGridY === y;
    });
  }, [desktopIcons]);

  const moveIcon = useCallback((id, x, y) => {
    setDesktopIcons((prev) =>
      prev.map((icon) =>
        icon.id === id ? { ...icon, initialPosition: { x, y } } : icon
      )
    );
  }, []);

  return { desktopIcons, isPositionOccupied, moveIcon, error };
};
