'use client';

import { useState, memo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = L.divIcon({
  html: '📍',
  className: 'custom-marker',
  iconSize: [24, 24],
  popupAnchor: [0, -12],
});

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const LocationPicker = memo(({ onLocationSelect, initialPosition = [9.03, 38.74] }) => {
  const [position, setPosition] = useState(initialPosition);
  const timeoutRef = useRef(null);

  const handleMapClick = async (lat, lng) => {
    setPosition([lat, lng]);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        const address = data.display_name || `${lat}, ${lng}`;
        onLocationSelect(lat, lng, address);
      } catch {
        onLocationSelect(lat, lng, `${lat}, ${lng}`);
      }
    }, 300);
  };

  return (
    <MapContainer
      key="map"
      center={position}
      zoom={13}
      style={{ height: '300px', width: '100%', borderRadius: '12px' }}
      scrollWheelZoom={true}
      dragging={true}
      zoomControl={true}
    >
      {/* Simple satellite view - just replace the TileLayer URL */}
      <TileLayer
        attribution='Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      
      {/* If you want a layer switcher instead, use this: */}
      {/* 
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Street">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        </LayersControl.BaseLayer>
      </LayersControl>
      */}
      
      <Marker position={position} icon={customIcon} />
      <MapClickHandler onMapClick={handleMapClick} />
    </MapContainer>
  );
});

LocationPicker.displayName = 'LocationPicker';
export default LocationPicker;