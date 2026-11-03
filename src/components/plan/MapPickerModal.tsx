import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { MapPin, Compass, Check } from 'lucide-react';
import { mumbaiPlacesDatabase, MumbaiPlaceSuggestion } from '../../data/mockStops';

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: {
    name: string;
    address: string;
    area: string;
    landmark: string;
    coordinates: { lat: number; lng: number };
  }) => void;
}

export const MapPickerModal: React.FC<MapPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
}) => {
  // Selected hotspot location
  const [selectedPlace, setSelectedPlace] = useState<MumbaiPlaceSuggestion>(
    mumbaiPlacesDatabase[0]
  );
  // Custom pin relative coordinates (percentage 0-100)
  const [pinPos, setPinPos] = useState<{ x: number; y: number }>({ x: 50, y: 45 });

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
    setPinPos({ x, y });

    // Pick closest place from database based on y-position (North to South in Mumbai)
    const normalizedIndex = Math.floor((y / 100) * (mumbaiPlacesDatabase.length - 1));
    const matched = mumbaiPlacesDatabase[normalizedIndex] || mumbaiPlacesDatabase[0];
    setSelectedPlace(matched);
  };

  const handleSelectHotspot = (place: MumbaiPlaceSuggestion, x: number, y: number) => {
    setSelectedPlace(place);
    setPinPos({ x, y });
  };

  const handleConfirm = () => {
    onSelectLocation({
      name: selectedPlace.name,
      address: selectedPlace.address,
      area: selectedPlace.area,
      landmark: selectedPlace.landmark,
      coordinates: { lat: selectedPlace.lat, lng: selectedPlace.lng },
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Drop Pin on Mumbai Transit Map"
      subtitle="Click anywhere on the corridor map to pick coordinates and landmarks"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="font-mono text-xs text-[var(--color-ink-secondary)] hidden sm:block">
            LAT: {selectedPlace.lat.toFixed(4)} · LNG: {selectedPlace.lng.toFixed(4)}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirm}
              icon={<Check className="w-4 h-4" />}
            >
              Confirm Pin & Set Stop
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Hotspot Presets */}
        <div>
          <span className="font-body font-semibold text-xs text-[var(--color-ink-muted)] uppercase tracking-wide block mb-2">
            Quick Landmark Hotspots:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { place: mumbaiPlacesDatabase[0], x: 62, y: 35, label: 'BKC' },
              { place: mumbaiPlacesDatabase[1], x: 42, y: 52, label: 'Dadar West' },
              { place: mumbaiPlacesDatabase[3], x: 38, y: 64, label: 'Lower Parel' },
              { place: mumbaiPlacesDatabase[7], x: 48, y: 72, label: 'Byculla' },
              { place: mumbaiPlacesDatabase[8], x: 50, y: 88, label: 'Colaba' },
              { place: mumbaiPlacesDatabase[5], x: 68, y: 22, label: 'Andheri East' },
            ].map((hotspot) => (
              <button
                key={hotspot.label}
                type="button"
                onClick={() => handleSelectHotspot(hotspot.place, hotspot.x, hotspot.y)}
                className={`px-3 py-1.5 text-xs font-body font-semibold rounded-full border transition-all cursor-pointer ${
                  selectedPlace.name === hotspot.place.name
                    ? 'bg-[var(--color-marigold)] text-[var(--color-ink)] border-[var(--color-marigold-hover)] shadow-sm'
                    : 'bg-[var(--color-surface)] text-[var(--color-ink)] border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)]'
                }`}
              >
                {hotspot.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Schematic Mumbai Map Canvas */}
        <div
          onClick={handleMapClick}
          className="relative w-full h-72 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-2xl cursor-crosshair overflow-hidden select-none shadow-inner"
        >
          {/* Subtle grid lines */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Mumbai Western & Central Coastlines / Arterials SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none">
            {/* Arabian Sea Coastline */}
            <path
              d="M 50 10 Q 110 90 90 150 T 130 250 L 140 280"
              stroke="var(--color-sky)"
              strokeWidth="3"
              strokeDasharray="4 4"
              opacity="0.7"
            />
            {/* Western Express Highway Spine */}
            <path
              d="M 180 10 L 170 90 Q 165 140 140 200 L 135 280"
              stroke="var(--color-ink)"
              strokeWidth="3"
              opacity="0.3"
            />
            {/* Central Railway Line Spine */}
            <path
              d="M 230 10 L 210 110 Q 195 160 170 240 L 160 280"
              stroke="var(--color-sage-deep)"
              strokeWidth="2"
              strokeDasharray="6 3"
              opacity="0.5"
            />
          </svg>

          {/* Hotspot anchor dots */}
          <div className="absolute left-[62%] top-[35%] w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-ink)] border-2 border-white pointer-events-none" />
          <div className="absolute left-[42%] top-[52%] w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-ink)] border-2 border-white pointer-events-none" />
          <div className="absolute left-[38%] top-[64%] w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-ink)] border-2 border-white pointer-events-none" />
          <div className="absolute left-[50%] top-[88%] w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-ink)] border-2 border-white pointer-events-none" />

          {/* Dropped Interactive Pin */}
          <div
            className="absolute transition-all duration-150 ease-out -translate-x-1/2 -translate-y-full pointer-events-none flex flex-col items-center"
            style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
          >
            <div className="px-2.5 py-0.5 bg-[#1F2A27] text-white dark:bg-[#101514] dark:text-[#FAF6EF] dark:border dark:border-[#2B3833] rounded-full font-mono text-[10px] font-medium whitespace-nowrap shadow-md mb-1">
              {selectedPlace.area}
            </div>
            <div className="w-8 h-8 rounded-full bg-[var(--color-marigold)] border-2 border-white shadow-lg flex items-center justify-center text-[var(--color-ink)]">
              <MapPin className="w-4 h-4 fill-current" />
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-ink)] -mt-0.5" />
          </div>

          <div className="absolute bottom-2.5 left-2.5 bg-[var(--color-surface)]/90 backdrop-blur-sm border border-[var(--color-border)] rounded-full px-3 py-1 text-[11px] font-body font-medium text-[var(--color-ink-secondary)] shadow-sm">
            Click anywhere on the map canvas to place pin
          </div>
        </div>

        {/* Selected Landmark Details Box */}
        <div className="p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-marigold-tint)] text-[var(--color-ink)] border border-[var(--color-marigold)]/30 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 text-[#8c5e03]" />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wide">
              Pinned Location Preview
            </div>
            <h4 className="font-body font-bold text-sm text-[var(--color-ink)] mt-0.5">
              {selectedPlace.name}
            </h4>
            <p className="font-body text-xs text-[var(--color-ink-secondary)] mt-0.5">
              {selectedPlace.address} · {selectedPlace.landmark} ({selectedPlace.area})
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};