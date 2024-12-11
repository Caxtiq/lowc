import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { DraggableItem } from './DraggableItem';
import { ComponentItem } from './YouOwnProject';

interface SidebarProps {
  items: ComponentItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const { setNodeRef } = useDroppable({
    id: 'sidebar-droppable',
  });

  return (
    <div
      ref={setNodeRef}
      className="w-64 border-r p-4 h-full overflow-y-auto"
    >
      <h3 className="text-lg font-semibold mb-4">Components</h3>
      {items.map((item) => (
        <DraggableItem key={item.id} item={item} />
      ))}
    </div>
  );
};

