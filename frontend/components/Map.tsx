"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix for default marker icon in leaflet with webpack
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically change map center
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function Map({ colleges }: { colleges: any[] }) {
  const [center, setCenter] = useState<[number, number]>([20.5937, 78.9629]); // Default to India center
  const zoom = 5;

  useEffect(() => {
    // If colleges exist, center on the first one that has valid coordinates
    const validColleges = colleges.filter(c => c.lat !== 0 && c.lng !== 0);
    if (validColleges.length > 0) {
      setCenter([validColleges[0].lat, validColleges[0].lng]);
    }
  }, [colleges]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm relative z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {colleges.filter(c => c.lat !== 0 && c.lng !== 0).map((college) => (
          <Marker 
            key={college.id} 
            position={[college.lat, college.lng]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-1 min-w-[200px]">
                <h3 className="font-bold text-sm mb-1">{college.name}</h3>
                <p className="text-xs text-zinc-500 mb-2">{college.city}, {college.state}</p>
                <a href={`/listings?college=${encodeURIComponent(college.name)}`} className="text-xs bg-primary text-primary-foreground px-3 py-2 rounded-xl block text-center font-bold hover:opacity-90">
                  View Listings
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
