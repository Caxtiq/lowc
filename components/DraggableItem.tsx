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
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { Activity, AlertTriangle, Bell, CheckSquare, FireExtinguisherIcon as FirstAidKit, Map, MapPin, Package, Route, Users } from 'lucide-react';
import dynamic from 'next/dynamic';
import React from 'react';

const DraggableMap = dynamic(() => import('./DraggableMap'), { ssr: false });


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
            <HoverCard>
              <HoverCardTrigger>
                <div className="flex items-center space-x-2 bg-blue-100 p-2 rounded" style={style}>
                  <MapPin className="text-blue-500" />
                  <span>{item.props.title || 'Map Marker'}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">{item.props.title || 'Map Marker Details'}</h4>
                  <div className="text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Longtitude:</span>
                      <span>{item.props.longitude || 'Not specified'}</span>
                      <span className="text-muted-foreground">Latitude:</span>
                      <span>{item.props.latitude || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        
      case 'resource-item':
        return (
          <HoverCard>
            <HoverCardTrigger>
              <div className="flex items-center space-x-2 bg-green-100 p-2 rounded" style={style}>
                <Package className="text-green-500" />
                <span>{item.props.title || 'Resource Item'}</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">{item.props.title || 'Resource Details'}</h4>
                <div className="text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{item.props.type || 'Not specified'}</span>
                    <span className="text-muted-foreground">Quantity:</span>
                    <span>{item.props.quantity || 0}</span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        );
        case 'personnel':
          return (
            <HoverCard>
              <HoverCardTrigger>
                <div className="flex items-center space-x-2 bg-yellow-100 p-2 rounded" style={style}>
                  <Users className="text-yellow-500" />
                  <span>{item.props.title || 'Personnel'}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">{item.props.title || 'Personnel Details'}</h4>
                  <div className="text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Title:</span>
                      <span>{item.props.title || 'Not specified'}</span>
                      <span className="text-muted-foreground">Specialty:</span>
                      <span>{item.props.specialty || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        
          case 'emergency-event':
            return (
              <HoverCard>
                <HoverCardTrigger>
                  <div className="flex items-center space-x-2 bg-red-100 p-2 rounded" style={style}>
                    <AlertTriangle className="text-red-500" />
                    <span>{item.props.title || 'Emergency Event'}</span>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">{item.props.title || 'Emergency Event Details'}</h4>
                    <div className="text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{item.props.location || 'Not specified'}</span>
                        <span className="text-muted-foreground">Severity:</span>
                        <span>{item.props.severity || 'Not specified'}</span>
                        <span className="text-muted-foreground">Type:</span>
                        <span>{item.props.type || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          
            case 'affected-area':
              return (
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="flex items-center space-x-2 bg-purple-100 p-2 rounded" style={style}>
                      <Map className="text-purple-500" />
                      <span>{item.props.title || 'Affected Area'}</span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{item.props.title || 'Affected Area Details'}</h4>
                      <div className="text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-muted-foreground">Location:</span>
                          <span>{item.props.location || 'Not specified'}</span>
                          <span className="text-muted-foreground">Type:</span>
                          <span>{item.props.type || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            
            case 'route-planning':
              return (
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="flex items-center space-x-2 bg-indigo-100 p-2 rounded" style={style}>
                      <Route className="text-indigo-500" />
                      <span>{item.props.title || 'Route Planning'}</span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{item.props.title || 'Route Planning Details'}</h4>
                      <div className="text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-muted-foreground">Point:</span>
                          <span>{item.props.way || 'Not specified'}</span>

                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            
            case 'tracking-item':
              return (
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="flex items-center space-x-2 bg-pink-100 p-2 rounded" style={style}>
                      <Activity className="text-pink-500" />
                      <span>{item.props.title || 'Tracking Item'}</span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{item.props.title || 'Tracking Item Details'}</h4>
                      <div className="text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-muted-foreground">Status:</span>
                          <span>{item.props.status || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            
            case 'task-list':
              return (
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded" style={style}>
                      <CheckSquare className="text-gray-500" />
                      <span>{item.props.title || 'Task List'}</span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{item.props.title || 'Task List Details'}</h4>
                      <div className="text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-muted-foreground">Tasks:</span>
                          <span>{item.props.items || 'Not specified'}</span>
                          <span className="text-muted-foreground">Completion Status:</span>
                          <span>{item.props.status || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            
            case 'alert':
              return (
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="flex items-center space-x-2 bg-orange-100 p-2 rounded" style={style}>
                      <Bell className="text-orange-500" />
                      <span>{item.props.title || 'Alert'}</span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{item.props.title || 'Alert Details'}</h4>
                      <div className="text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-muted-foreground">Urgency:</span>
                          <span>{item.props.urgency || 'Not specified'}</span>
                          <span className="text-muted-foreground">Description:</span>
                          <span>{item.props.content || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            
            case 'essential-supply':
              return (
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="flex items-center space-x-2 bg-teal-100 p-2 rounded" style={style}>
                      <FirstAidKit className="text-teal-500" />
                      <span>{item.props.title || 'Essential Supply'}</span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{item.props.title || 'Essential Supply Details'}</h4>
                      <div className="text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-muted-foreground">Type:</span>
                          <span>{item.props.type || 'Not specified'}</span>
                          <span className="text-muted-foreground">Quantity:</span>
                          <span>{item.props.quantity || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            
      case 'draggable-map':
        return (
          <div style={{ width: '400px', height: '400px', ...style }}>
            <DraggableMap 
              onMarkerAdd={(lat, lng) => console.log(`Marker added at ${lat}, ${lng}`)}
              onMarkerMove={(lat, lng) => console.log(`Marker moved to ${lat}, ${lng}`)}
              initialPosition={[item.props.latitude || 51.505, item.props.longitude || -0.09]}
            />
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