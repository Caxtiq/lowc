import { DndContext, PointerSensor, UniqueIdentifier, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';

export interface ComponentItem {
  id: string;
  content: string;
  type: 'button' | 'textfield';
  props: {
    text?: string;
    action?: string;
    placeholder?: string;
  };
}

const YouOwnProject: React.FC = () => {
  const [sidebarItems] = useState<ComponentItem[]>([
    { id: 'button', content: 'Button', type: 'button', props: { text: 'Click me', action: 'console.log("Button clicked")' } },
    { id: 'textfield', content: 'Text Field', type: 'textfield', props: { placeholder: 'Enter text' } },
  ]);
  const [droppedItems, setDroppedItems] = useState<ComponentItem[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null); // Chỉnh sửa thành UniqueIdentifier
  const [selectedItem, setSelectedItem] = useState<ComponentItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Hàm xử lý khi bắt đầu kéo
  const handleDragStart = (event: { active: { id: UniqueIdentifier } }) => { // Chỉnh sửa kiểu active.id
    setActiveId(event.active.id);
  };

  // Hàm xử lý khi kết thúc kéo
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (over.id === 'drop-area') {
      const draggedItem = sidebarItems.find(item => item.id === active.id);
      if (draggedItem) {
        setDroppedItems([...droppedItems, draggedItem]);
      }
    } else if (over.id === 'sidebar-droppable' && typeof active.id === 'string' && active.id.includes('-')) {
      // Kiểm tra active.id có phải là string và có chứa dấu '-'
      setDroppedItems(droppedItems.filter(item => item.id !== active.id));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen overflow-hidden">
        <Sidebar items={sidebarItems} />
        {/* Các thành phần khác */}
      </div>
    </DndContext>
  );
};

export default YouOwnProject;
