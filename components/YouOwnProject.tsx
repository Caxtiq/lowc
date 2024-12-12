'use client'

import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { globalEventEmitter } from '@/lib/observer';
import { ComponentItem } from '@/types/ComponentItem';
import { DndContext, DragOverlay, PointerSensor, UniqueIdentifier, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import React, { useEffect, useState } from 'react';
import { DraggableItem } from './DraggableItem';
import { DropArea } from './DropArea';
import { EditPanel } from './EditPanel';
import { ExportButton } from './ExportButton';
import { Sidebar } from './Sidebar';

const YouOwnProject: React.FC = () => {
  const [sidebarItems] = useState<ComponentItem[]>([
    { id: 'button', content: 'Button', type: 'button', props: {
      text: 'Click me', action: 'console.log("Button clicked")', color: '#ffffff',
      zoom: 0
    } },
    { id: 'textfield', content: 'Text Field', type: 'textfield', props: {
      placeholder: 'Enter text', color: '#ffffff',
      zoom: 0
    } },
    { id: 'modal', content: 'Modal Dialog', type: 'modal', props: {
      title: 'Modal Title', content: 'Modal Content', color: '#ffffff',
      zoom: 0
    } },
    { id: 'card', content: 'Card View', type: 'card', props: {
      title: 'Card Title', content: 'Card Content', color: '#ffffff',
      zoom: 0
    } },
    { id: 'expandable-list', content: 'Expandable List', type: 'expandable-list', props: {
      items: ['Item 1', 'Item 2', 'Item 3'], color: '#ffffff',
      zoom: 0
    } },
    { id: 'tab-navigation', content: 'Tab Navigation', type: 'tab-navigation', props: {
      tabs: [{ label: 'Tab 1', content: 'Content 1' }, { label: 'Tab 2', content: 'Content 2' }], color: '#ffffff',
      zoom: 0
    } },
    { id: 'searchable-dropdown', content: 'Searchable Dropdown', type: 'searchable-dropdown', props: {
      options: [{ value: 'option1', label: 'Option 1' }, { value: 'option2', label: 'Option 2' }], color: '#ffffff',
      zoom: 0
    } },
    { id: 'map-marker', content: 'Map Marker', type: 'map-marker', props: {
      title: 'New Marker', latitude: 0, longitude: 0, color: '#ffffff',
      zoom: 0
    } },
    { id: 'resource-item', content: 'Resource Item', type: 'resource-item', props: {
      title: 'New Resource', type: 'Food', quantity: 0, color: '#ffffff',
      zoom: 0
    } },
    { id: 'personnel', content: 'Personnel', type: 'personnel', props: {
      title: 'New Personnel', specialty: 'Medical', color: '#ffffff',
      zoom: 0
    } },
    { id: 'emergency-event', content: 'Emergency Event', type: 'emergency-event', props: {
      title: 'New Emergency', type: 'Flood', severity: 'High', color: '#ffffff',
      zoom: 0
    } },
    { id: 'affected-area', content: 'Affected Area', type: 'affected-area', props: {
      title: 'New Affected Area', type: 'Flood Zone', color: '#ffffff',
      zoom: 0
    } },
    { id: 'route-planning', content: 'Route Planning', type: 'route-planning', props: {
      title: 'New Route', route: { start: '', end: '' }, color: '#ffffff',
      zoom: 0
    } },
    { id: 'tracking-item', content: 'Tracking Item', type: 'tracking-item', props: {
      title: 'New Tracking Item', status: 'In Progress', progress: 0, color: '#ffffff',
      zoom: 0
    } },
    { id: 'task-list', content: 'Task List', type: 'task-list', props: {
      title: 'New Task List', items: ['Task 1', 'Task 2'], color: '#ffffff',
      zoom: 0
    } },
    { id: 'alert', content: 'Alert', type: 'alert', props: {
      title: 'New Alert', content: 'Alert content', urgency: 'medium', color: '#ffffff',
      zoom: 0
    } },
    { id: 'essential-supply', content: 'Essential Supply', type: 'essential-supply', props: {
      title: 'New Supply', type: 'Medical', quantity: 0, color: '#ffffff',
      zoom: 0
    } },
    { id: 'draggable-map', content: 'Draggable Map', type: 'draggable-map', props: { title: 'Interactive Map', zoom: 13, color: '#ffffff' } },
  ]);
  const [droppedItems, setDroppedItems] = useState<ComponentItem[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [selectedItem, setSelectedItem] = useState<ComponentItem | null>(null);
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const buttonClickListener = (buttonText: string) => {
      setToast({ title: 'Button Clicked', description: `The button "${buttonText}" was clicked.` });
    };

    const optionSelectedListener = (optionValue: string) => {
      setToast({ title: 'Option Selected', description: `The option with value "${optionValue}" was selected.` });
    };

    globalEventEmitter.on('buttonClicked', buttonClickListener);
    globalEventEmitter.on('optionSelected', optionSelectedListener);

    return () => {
      globalEventEmitter.off('buttonClicked', buttonClickListener);
      globalEventEmitter.off('optionSelected', optionSelectedListener);
    };
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (over.id === 'drop-area') {
      const draggedItem = sidebarItems.find(item => item.id === active.id);
      if (draggedItem) {
        const newItem = {
          ...draggedItem,
          id: `${draggedItem.id}-${Date.now()}`,
        };
        setDroppedItems([...droppedItems, newItem]);
      }
    } else if (over.id === 'sidebar-droppable' && typeof active.id === 'string' && active.id.includes('-')) {
      setDroppedItems(droppedItems.filter(item => item.id !== active.id));
    }

    setActiveId(null);
  };

  const handleItemSelect = (item: ComponentItem) => {
    setSelectedItem(item);
  };

  const handleItemUpdate = (updatedItem: ComponentItem) => {
    setDroppedItems(droppedItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setSelectedItem(updatedItem);
  };

  return (
    <ToastProvider>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar items={sidebarItems} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-4 overflow-auto">
              <h2 className="text-2xl font-bold mb-4">Your Drag and Drop Page</h2>
              <DropArea items={droppedItems} onItemSelect={handleItemSelect} />
            </div>
            <div className="h-1/3 border-t">
              <EditPanel selectedItem={selectedItem} onItemUpdate={handleItemUpdate} />
            </div>
          </div>
          <ExportButton items={droppedItems} />
        </div>
        <DragOverlay>
          {activeId ? (
            <DraggableItem
              item={sidebarItems.find((item) => item.id === activeId) ?? 
              droppedItems.find((item) => item.id === activeId) ?? 
              { id: '', content: '', type: 'button', props: { zoom: 0 } }}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
      {toast && (
        <Toast>
          <ToastTitle>{toast.title}</ToastTitle>
          <ToastDescription>{toast.description}</ToastDescription>
        </Toast>
      )}
      <ToastViewport />
    </ToastProvider>
  );
};

export default YouOwnProject;

