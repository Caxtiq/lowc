import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

interface DraggableMapProps {
  onMarkerAdd: (lat: number, lng: number) => void;
  onMarkerMove: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
}

const DraggableMap: React.FC<DraggableMapProps> = ({ onMarkerAdd, onMarkerMove, initialPosition = [51.505, -0.09] }) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (map) {
      map.invalidateSize();
    }
  }, [map]);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
        setMarkerPosition(newPosition);
        onMarkerAdd(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const handleMarkerDrag = (e: L.LeafletEvent) => {
    const marker = e.target;
    const position = marker.getLatLng();
    setMarkerPosition([position.lat, position.lng]);
    onMarkerMove(position.lat, position.lng);
  };

  return (
    <MapContainer 
      center={initialPosition} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
      whenReady = {() => setMarkerPosition(initialPosition)}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEvents />
      {markerPosition && (
        <Marker
          draggable={true}
          position={markerPosition}
          eventHandlers={{ dragend: handleMarkerDrag }}
        />
      )}
    </MapContainer>
  );
};

export default DraggableMap;

