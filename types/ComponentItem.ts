export interface ComponentItem {
  id: string;
  content: string;
  type: 'button' | 'textfield' | 'modal' | 'card' | 'expandable-list' | 'tab-navigation' | 'searchable-dropdown' |
        'map-marker' | 'resource-item' | 'personnel' | 'emergency-event' | 'affected-area' | 'route-planning' |
        'tracking-item' | 'task-list' | 'alert' | 'essential-supply' | 'draggable-map' ;
  props: {
    zoom: number;
    text?: string;
    action?: string;
    placeholder?: string;
    title?: string;
    content?: string;
    items?: string[];
    tabs?: { label: string; content: string }[];
    options?: { value: string; label: string }[];
    latitude?: number;
    longitude?: number;
    type?: string;
    quantity?: number;
    specialty?: string;
    severity?: string;
    status?: string;
    route?: { start: string; end: string };
    progress?: number;
    dueDate?: string;
    urgency?: 'low' | 'medium' | 'high';
    color?: string;
    style?: React.CSSProperties;
    location?:string;
    way?:string;
    
  };
}

