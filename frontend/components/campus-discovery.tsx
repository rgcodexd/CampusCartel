"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

type College = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

// We would typically fetch this from our backend `/api/v1/colleges`,
// but for simplicity of the UI component we can pass it as props or hardcode the top ones.
const SAMPLE_COLLEGES: College[] = [
  { id: "du-north", name: "Delhi University North Campus", lat: 28.6889, lng: 77.2093 },
  { id: "iitd", name: "IIT Delhi", lat: 28.545, lng: 77.1926 },
  { id: "ipu", name: "IP University", lat: 28.5955, lng: 77.0157 },
];

export function CampusDiscovery({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number, radiusKm: number) => void;
}) {
  const [selectedCollege, setSelectedCollege] = useState<string>("du-north");
  const [radius, setRadius] = useState<number>(5);

  const handleApply = () => {
    const college = SAMPLE_COLLEGES.find((c) => c.id === selectedCollege);
    if (college) {
      onLocationChange(college.lat, college.lng, radius);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-surface border p-4 rounded-2xl shadow-sm w-full max-w-3xl">
      <div className="flex items-center gap-3 w-full md:w-auto flex-1">
        <MapPin className="text-primary h-5 w-5 flex-shrink-0" />
        <select
          value={selectedCollege}
          onChange={(e) => setSelectedCollege(e.target.value)}
          className="bg-transparent border-none text-foreground font-semibold text-sm outline-none w-full cursor-pointer"
        >
          {SAMPLE_COLLEGES.map((c) => (
            <option key={c.id} value={c.id} className="text-foreground bg-background">
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="h-px md:h-8 w-full md:w-px bg-border flex-shrink-0" />

      <div className="flex items-center gap-3 w-full md:w-auto flex-1">
        <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">Radius: {radius} km</span>
        <input
          type="range"
          min={1}
          max={50}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
      </div>

      <button
        onClick={handleApply}
        className="bg-primary text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-primary/90 transition shadow-sm w-full md:w-auto"
      >
        Search Area
      </button>
    </div>
  );
}
