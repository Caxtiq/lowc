import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ComponentItem } from './YouOwnProject';

interface DraggableItemProps {
  item: ComponentItem;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="cursor-move touch-none select-none"
    >
      {item.type === 'button' && (
        <Button onClick={() => eval(item.props.action || '')}>
          {item.props.text || 'Button'}
        </Button>
      )}
      {item.type === 'textfield' && (
        <Input placeholder={item.props.placeholder || 'Enter text'} />
      )}
    </div>
  );
};

