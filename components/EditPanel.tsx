import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ComponentItem } from '@/types/ComponentItem';
import { InfoIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface EditPanelProps {
  selectedItem: ComponentItem | null;
  onItemUpdate: (item: ComponentItem) => void;
}

export const EditPanel: React.FC<EditPanelProps> = ({ selectedItem, onItemUpdate }) => {
  const [editedItem, setEditedItem] = useState<ComponentItem | null>(null);

  useEffect(() => {
    setEditedItem(selectedItem);
  }, [selectedItem]);

  if (!editedItem) {
    return <div className="p-4">Select an item to edit</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value : string } }) => {
    const { name, value } = e.target;
    setEditedItem(prev => {
      if (!prev) return null;
      return {
        ...prev,
        props: {
          ...prev.props,
          [name]: value,
        },
      };
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedItem(prev => {
      if (!prev) return null;
      return {
        ...prev,
        props: {
          ...prev.props,
          [name]: parseFloat(value),
        },
      };
    });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, propName: 'tabs' | 'options' | 'items') => {
    const value = e.target.value;
    setEditedItem(prev => {
      if (!prev) return null;
      let newProps: Partial<ComponentItem['props']> = {};
      if (propName === 'tabs') {
        newProps.tabs = value.split('\n').map(line => {
          const [label, content] = line.split(':');
          return { label: label?.trim() ?? '', content: content?.trim() ?? '' };
        });
      } else if (propName === 'options') {
        newProps.options = value.split('\n').map(line => {
          const [value, label] = line.split(':');
          return { value: value?.trim() ?? '', label: label?.trim() ?? '' };
        });
      } else {
        newProps[propName] = value.split('\n').map(item => item.trim());
      }
      return {
        ...prev,
        props: {
          ...prev.props,
          ...newProps,
        },
      };
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEditedItem(prev => {
      if (!prev) return null;
      return {
        ...prev,
        props: {
          ...prev.props,
          color: value,
        },
      };
    });
  };

  const handleSave = () => {
    if (editedItem) {
      onItemUpdate(editedItem);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Edit {editedItem.type}</h3>
      <div className="mb-4">
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          name="color"
          type="color"
          value={editedItem.props.color || '#ffffff'}
          onChange={handleColorChange}
        />
      </div>
      {editedItem.type === 'button' && (
        <>
          <div className="mb-4">
            <Label htmlFor="text">Button Text</Label>
            <Input
              id="text"
              name="text"
              value={editedItem.props.text || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="action">Button Action</Label>
            <Input
              id="action"
              name="action"
              value={editedItem.props.action || ''}
              onChange={handleChange}
            />
          </div>
        </>
      )}
      {editedItem.type === 'textfield' && (
        <div className="mb-4">
          <Label htmlFor="placeholder">Placeholder</Label>
          <Input
            id="placeholder"
            name="placeholder"
            value={editedItem.props.placeholder || ''}
            onChange={handleChange}
          />
        </div>
      )}
      {(editedItem.type === 'modal' || editedItem.type === 'card') && (
        <>
          <div className="mb-4">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={editedItem.props.title || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={editedItem.props.content || ''}
              onChange={handleChange}
            />
          </div>
        </>
      )}
      {editedItem.type === 'expandable-list' && (
        <div className="mb-4">
          <Label htmlFor="items">List Items (one per line)</Label>
          <Textarea
            id="items"
            name="items"
            value={editedItem.props.items?.join('\n') ?? ''}
            onChange={(e) => handleArrayChange(e, 'items')}
          />
        </div>
      )}
      {editedItem.type === 'tab-navigation' && (
        <div className="mb-4">
          <Label htmlFor="tabs">Tabs (label:content, one per line)</Label>
          <Textarea
            id="tabs"
            name="tabs"
            value={editedItem.props.tabs?.map(tab => `${tab.label}:${tab.content}`).join('\n') ?? ''}
            onChange={(e) => handleArrayChange(e, 'tabs')}
          />
        </div>
      )}
      {editedItem.type === 'searchable-dropdown' && (
        <div className="mb-4">
          <Label htmlFor="options">Options (value:label, one per line)</Label>
          <Textarea
            id="options"
            name="options"
            value={editedItem.props.options?.map(option => `${option.value}:${option.label}`).join('\n') ?? ''}
            onChange={(e) => handleArrayChange(e, 'options')}
          />
        </div>
      )}
      {editedItem.type === 'map-marker' && (
        <>
          <div className="mb-4">
            <Label htmlFor="title">Marker Title</Label>
            <Input
              id="title"
              name="title"
              value={editedItem.props.title || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              value={editedItem.props.latitude || 0}
              onChange={handleNumberChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              value={editedItem.props.longitude || 0}
              onChange={handleNumberChange}
            />
          </div>
        </>
      )}
      {editedItem.type === 'resource-item' && (
        <>
          <div className="mb-4">
            <Label htmlFor="title">Resource Name</Label>
            <Input
              id="title"
              name="title"
              value={editedItem.props.title || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="type">Resource Type</Label>
              <Popover>
                <PopoverTrigger>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </PopoverTrigger>
                <PopoverContent>
                  <p>Select the type of resource. This helps in categorizing and managing different kinds of supplies.</p>
                </PopoverContent>
              </Popover>
            </div>
            <Select name="type" value={editedItem.props.type || ''} onValueChange={(value) => handleChange({ target: { name: 'type', value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select resource type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Water">Water</SelectItem>
                <SelectItem value="Medicine">Medicine</SelectItem>
                <SelectItem value="Shelter">Shelter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="quantity">Quantity</Label>
              <Popover>
                <PopoverTrigger>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </PopoverTrigger>
                <PopoverContent>
                  <p>Enter the amount of this resource available. Use whole numbers.</p>
                </PopoverContent>
              </Popover>
            </div>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={editedItem.props.quantity || 0}
              onChange={handleNumberChange}
            />
          </div>
        </>
      )}
      {editedItem.type === 'personnel' && (
        <>
          <div className="mb-4">
            <Label htmlFor="title">Name</Label>
            <Input
              id="title"
              name="title"
              value={editedItem.props.title || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="specialty">Specialty</Label>
            <Select name="specialty" value={editedItem.props.specialty || ''} onValueChange={(value) => handleChange({ target: { name: 'specialty', value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Medical">Medical</SelectItem>
                <SelectItem value="Rescue">Rescue</SelectItem>
                <SelectItem value="Logistics">Logistics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      {editedItem.type === 'emergency-event' && (
        <>
          <div className="mb-4">
            <Label htmlFor="title">Event Name</Label>
            <Input
              id="title"
              name="title"
              value={editedItem.props.title || ''}
              onChange={handleChange}
            />
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={editedItem.props.location || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="type">Event Type</Label>
            <Select name="type" value={editedItem.props.type || ''} onValueChange={(value) => handleChange({ target: { name: 'type', value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Flood">Flood</SelectItem>
                <SelectItem value="Earthquake">Earthquake</SelectItem>
                <SelectItem value="Hurricane">Hurricane</SelectItem>
                <SelectItem value="Wildfire">Wildfire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Label htmlFor="severity">Severity</Label>
            <Select name="severity" value={editedItem.props.severity || ''} onValueChange={(value) => handleChange({ target: { name: 'severity', value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      {editedItem.type === 'affected-area' && (
        <>
          <div className="mb-4">
            <Label htmlFor="title">Area Name</Label>
            <Input
              id="title"
              name="title"
              value={editedItem.props.title || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="type">Area Type</Label>
            <Select name="type" value={editedItem.props.type || ''} onValueChange={(value) => handleChange({ target: { name: 'type', value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select area type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Flood Zone">Flood Zone</SelectItem>
                <SelectItem value="Evacuation Zone">Evacuation Zone</SelectItem>
                <SelectItem value="Quarantine Area">Quarantine Area</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      {editedItem.type === 'route-planning' && (
        <>
          <div className="mb-4">
            <Label htmlFor="title">Route Name</Label>
            <Input
              id="title"
              name="title"
              value={editedItem.props.title || ''}
              onChange={handleChange}
            />
            <Label htmlFor="way">Googlemap link</Label>
            <Input
              id="way"
              name="way"
              value={editedItem.props.title || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="route.start">Start Point</Label>
            <Input
              id="route.start"
              name="route.start"
              value={editedItem.props.route?.start || ''}
              onChange={(e) => {
                const newRoute = { ...editedItem.props.route, start: e.target.value };
                handleChange({ target: { name: 'route', value: newRoute as unknown as string } });
              }}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="route.end">End Point</Label>
            <Input
              id="route.end"
              name="route.end"
              value={editedItem.props.route?.end || ''}
              onChange={(e) => {
                const newRoute = { ...editedItem.props.route, end: e.target.value };
                handleChange({ target: { name: 'route', value: newRoute as unknown as string } });
              }}
            />
          </div>
        </>
      )}
      {editedItem.type === 'tracking-item' && (
        <>
          <div className="mb-4">
            <Label htmlFor="title">Item Name</Label>
            <Input
              id="title"
              name="title"
              value={editedItem.props.title || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="status">Status</Label>
            <Select name="status" value={editedItem.props.status || ''} onValueChange={(value) => handleChange({ target: { name: 'status', value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Label htmlFor="progress">Progress (%)</Label>
            <Input
              id="progress"
              name="progress"
              type="number"
              min="0"
              max="100"
              value={editedItem.props.progress || 0}
              onChange={handleNumberChange}
            />
          </div>
        </>
      )}
      {editedItem.type === 'task-list' && (
        <>
          <div className="mb-4">
            <Label htmlFor="title">List Name</Label>
            <Input
              id="title"
              name="title"
              value={editedItem.props.title || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="items">Tasks (one per line)</Label>
            <Textarea
              id="items"
              name="items"
              value={editedItem.props.items?.join('\n') ?? ''}
              onChange={(e) => handleArrayChange(e, 'items')}
            />
          </div>
        </>
      )}
      {editedItem.type === 'alert' && (
        <>
          <div className="mb-4">
            <Label htmlFor="title">Alert Title</Label>
            <Input
              id="title"
              name="title"
              value={editedItem.props.title || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="content">Alert Content</Label>
            <Textarea
              id="content"
              name="content"
              value={editedItem.props.content || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="urgency">Urgency</Label>
            <Select name="urgency" value={editedItem.props.urgency || ''} onValueChange={(value) => handleChange({ target: { name: 'urgency', value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      {editedItem.type === 'essential-supply' && (
        <>
          <div className="mb-4">
            <Label htmlFor="title">Supply Name</Label>
            <Input
              id="title"
              name="title"
              value={editedItem.props.title || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="type">Supply Type</Label>
            <Select name="type" value={editedItem.props.type || ''} onValueChange={(value) => handleChange({ target: { name: 'type', value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select supply type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Medical">Medical</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Water">Water</SelectItem>
                <SelectItem value="Shelter">Shelter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={editedItem.props.quantity || 0}
              onChange={handleNumberChange}
            />
          </div>
        </>
      )}
      {editedItem.type === 'draggable-map' && (
        <>
          <div className="mb-4">
            <Label htmlFor="title">Map Title</Label>
            <Input
              id="title"
              name="title"
              value={editedItem.props.title || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="latitude">Initial Latitude</Label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              value={editedItem.props.latitude || 51.505}
              onChange={handleNumberChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="longitude">Initial Longitude</Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              value={editedItem.props.longitude || -0.09}
              onChange={handleNumberChange}
            />
          </div>
        </>
      )}
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
};

