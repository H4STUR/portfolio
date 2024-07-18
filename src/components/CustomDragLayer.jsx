import React from 'react';
import { useDragLayer } from 'react-dnd';
import Icon from './Icon';
import '../styles/customDragLayer.css';

const CustomDragLayer = () => {
  const { itemType, isDragging, item, currentOffset } = useDragLayer(monitor => ({
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging || !currentOffset) {
    return null;
  }

  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;

  return (
    <div className="custom-drag-layer">
      <div style={{ transform }}>
        <Icon title={item.title} position={{ x, y }} />
      </div>
    </div>
  );
};

export default CustomDragLayer;
