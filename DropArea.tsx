import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { DraggableItem } from './DraggableItem';
import { ComponentItem } from './YouOwnProject';

interface DropAreaProps {
  items: ComponentItem[];
  onItemSelect: (item: ComponentItem) => void;
}

export const DropArea: React.FC<DropAreaProps> = ({ items, onItemSelect }) => {
  const { setNodeRef } = useDroppable({
    id: 'drop-area',
  });

  return (
    <div
      ref={setNodeRef}
      className="p-4 border-2 border-dashed rounded-lg min-h-[400px] flex flex-wrap gap-4"
    >
      {items.map((item) => (
        <div key={item.id} onClick={() => onItemSelect(item)}>
          <DraggableItem item={item} />
        </div>
      ))}
      {items.length === 0 && <p className="text-gray-500">Drag components here</p>}
    </div>
  );
};

