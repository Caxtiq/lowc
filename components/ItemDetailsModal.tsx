import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ComponentItem } from '@/types/ComponentItem';
import React from 'react';

interface ItemDetailsModalProps {
  item: ComponentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ item, isOpen, onClose }) => {
  if (!item) return null;

  const renderDetails = () => {
    switch (item.type) {
      case 'map-marker':
        return (
          <>
            <p>Title: {item.props.title}</p>
            <p>Latitude: {item.props.latitude}</p>
            <p>Longitude: {item.props.longitude}</p>
          </>
        );
      case 'resource-item':
        return (
          <>
            <p>Name: {item.props.title}</p>
            <p>Type: {item.props.type}</p>
            <p>Quantity: {item.props.quantity}</p>
          </>
        );
      case 'personnel':
        return (
          <>
            <p>Name: {item.props.title}</p>
            <p>Specialty: {item.props.specialty}</p>
          </>
        );
      case 'emergency-event':
        return (
          <>
            <p>Event: {item.props.title}</p>
            <p>Type: {item.props.type}</p>
            <p>Severity: {item.props.severity}</p>
          </>
        );
      case 'affected-area':
        return (
          <>
            <p>Area: {item.props.title}</p>
            <p>Type: {item.props.type}</p>
          </>
        );
      case 'route-planning':
        return (
          <>
            <p>Route: {item.props.title}</p>
            <p>Start: {item.props.route?.start}</p>
            <p>End: {item.props.route?.end}</p>
          </>
        );
      case 'tracking-item':
        return (
          <>
            <p>Item: {item.props.title}</p>
            <p>Status: {item.props.status}</p>
            <p>Progress: {item.props.progress}%</p>
          </>
        );
      case 'task-list':
        return (
          <>
            <p>List: {item.props.title}</p>
            <p>Tasks:</p>
            <ul>
              {item.props.items?.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </>
        );
      case 'alert':
        return (
          <>
            <p>Title: {item.props.title}</p>
            <p>Content: {item.props.content}</p>
            <p>Urgency: {item.props.urgency}</p>
          </>
        );
      case 'essential-supply':
        return (
          <>
            <p>Supply: {item.props.title}</p>
            <p>Type: {item.props.type}</p>
            <p>Quantity: {item.props.quantity}</p>
          </>
        );
      default:
        return <p>No details available</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item.props.title || 'Item Details'}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {renderDetails()}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

