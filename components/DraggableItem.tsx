import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SearchableDropdown } from "@/components/ui/searchable-dropdown";
import { TabNavigation } from "@/components/ui/tab-navigation";
import { globalEventEmitter } from '@/lib/observer';
import { ComponentItem } from '@/types/ComponentItem';
import { useDraggable } from '@dnd-kit/core';
import { Activity, AlertTriangle, Bell, CheckSquare, FireExtinguisherIcon as FirstAidKit, Map, MapPin, Package, Route, Users } from 'lucide-react';
import React from 'react';


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

  const renderComponent = () => {
    const style = item.props.color ? { backgroundColor: item.props.color } : {};

    switch (item.type) {
      case 'button':
        return (
          <Button 
            onClick={() => {
              eval(item.props.action || '');
              globalEventEmitter.emit('buttonClicked', item.props.text);
            }}
            style={style}
          >
            {item.props.text || 'Button'}
          </Button>
        );
      case 'textfield':
        return <Input placeholder={item.props.placeholder || 'Enter text'} style={style} />;
      case 'modal':
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" style={style}>Open Modal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{item.props.title || 'Modal Title'}</DialogTitle>
                <DialogDescription>
                  {item.props.content || 'Modal Content'}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        );
      case 'card':
        return (
          <Card className="w-[350px]" style={style}>
            <CardHeader>
              <CardTitle>{item.props.title || 'Card Title'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{item.props.content || 'Card Content'}</p>
            </CardContent>
          </Card>
        );
      case 'expandable-list':
        return (
          <Accordion type="single" collapsible className="w-full" style={style}>
            {(item.props.items || ['Item 1', 'Item 2', 'Item 3']).map((listItem, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{listItem}</AccordionTrigger>
                <AccordionContent>
                  Content for {listItem}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        );
      case 'tab-navigation':
        return (
          <TabNavigation tabs={item.props.tabs || [
            { label: 'Tab 1', content: 'Content for Tab 1' },
            { label: 'Tab 2', content: 'Content for Tab 2' },
            { label: 'Tab 3', content: 'Content for Tab 3' },
          ]} style={style}/>
        );
      case 'searchable-dropdown':
        return (
          <SearchableDropdown
            options={item.props.options || [
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' },
            ]}
            onSelect={(value) => globalEventEmitter.emit('optionSelected', value)}
            style={style}
          />
        );
      case 'map-marker':
        return (
          <div className="flex items-center space-x-2 bg-blue-100 p-2 rounded" style={style}>
            <MapPin className="text-blue-500" />
            <span>{item.props.title || 'Map Marker'}</span>
          </div>
        );
      case 'resource-item':
        return (
          <div className="flex items-center space-x-2 bg-green-100 p-2 rounded" style={style}>
            <Package className="text-green-500" />
            <span>{item.props.title || 'Resource Item'}</span>
          </div>
        );
      case 'personnel':
        return (
          <div className="flex items-center space-x-2 bg-yellow-100 p-2 rounded" style={style}>
            <Users className="text-yellow-500" />
            <span>{item.props.title || 'Personnel'}</span>
          </div>
        );
      case 'emergency-event':
        return (
          <div className="flex items-center space-x-2 bg-red-100 p-2 rounded" style={style}>
            <AlertTriangle className="text-red-500" />
            <span>{item.props.title || 'Emergency Event'}</span>
          </div>
        );
      case 'affected-area':
        return (
          <div className="flex items-center space-x-2 bg-purple-100 p-2 rounded" style={style}>
            <Map className="text-purple-500" />
            <span>{item.props.title || 'Affected Area'}</span>
          </div>
        );
      case 'route-planning':
        return (
          <div className="flex items-center space-x-2 bg-indigo-100 p-2 rounded" style={style}>
            <Route className="text-indigo-500" />
            <span>{item.props.title || 'Route Planning'}</span>
          </div>
        );
      case 'tracking-item':
        return (
          <div className="flex items-center space-x-2 bg-pink-100 p-2 rounded" style={style}>
            <Activity className="text-pink-500" />
            <span>{item.props.title || 'Tracking Item'}</span>
          </div>
        );
      case 'task-list':
        return (
          <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded" style={style}>
            <CheckSquare className="text-gray-500" />
            <span>{item.props.title || 'Task List'}</span>
          </div>
        );
      case 'alert':
        return (
          <div className="flex items-center space-x-2 bg-orange-100 p-2 rounded" style={style}>
            <Bell className="text-orange-500" />
            <span>{item.props.title || 'Alert'}</span>
          </div>
        );
      case 'essential-supply':
        return (
          <div className="flex items-center space-x-2 bg-teal-100 p-2 rounded" style={style}>
            <FirstAidKit className="text-teal-500" />
            <span>{item.props.title || 'Essential Supply'}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ ...style, ...(item.props.color ? { backgroundColor: item.props.color } : {}) }}
      className="cursor-move touch-none select-none"
    >
      {renderComponent()}
    </div>
  );
};

