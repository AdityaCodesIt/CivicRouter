import React, { useState } from 'react';
import { useRoute } from '../../context/RouteContext';
import { mumbaiPitstopRadar, PitstopRadarOption } from '../../data/wishlistItems';
import {
  Droplets,
  Fuel,
  Coffee,
  Sparkles,
  Plus,
  Compass,
  Check,
} from 'lucide-react';

interface PitstopRadarRowProps {
  className?: string;
  showSimulatorButton?: boolean;
}

export const PitstopRadarRow: React.FC<PitstopRadarRowProps> = ({
  className = '',
  showSimulatorButton = true,
}) => {
  const { triggerMockOnTheWayPrompt, addStop } = useRoute();
  const [addedId, setAddedId] = useState<string | null>(null);

  const getRadarIcon = (type: string) => {
    switch (type) {
      case 'water':
        return <Droplets className="w-3.5 h-3.5 text-[var(--color-sky-accent)]" />;
      case 'restroom':
        return <Droplets className="w-3.5 h-3.5 text-[var(--color-sage-deep)]" />;
      case 'fuel':
        return <Fuel className="w-3.5 h-3.5 text-[var(--color-priority-high)]" />;
      case 'chai':
      default:
        return <Coffee className="w-3.5 h-3.5 text-[#8c5e03]" />;
    }
  };

  const handleQuickAddRadar = (item: PitstopRadarOption) => {
    addStop({
      recipientName: item.title,
      address: `${item.landmark}, ${item.area}`,
      area: item.area,
      landmark: item.landmark,
      priority: 'low',
      type: 'drop',
      parcelCount: 0,
      codAmount: 0,
      etaMinutes: 10,
      distanceKm: 1.5,
      notes: `Pitstop radar: ${(item.type || 'radar').toUpperCase()} · ${item.distanceOffRouteMeters}m off corridor`,
      coordinates: { lat: 19.018, lng: 72.842 },
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div
      className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm p-3.5 ${className}`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[var(--color-marigold)]" />
          <span className="font-mono text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wide">
            Pit-Stop Radar Along Corridor
          </span>
        </div>

        {/* Mock Simulator Button */}
        {showSimulatorButton && (
          <button
            type="button"
            onClick={() => triggerMockOnTheWayPrompt()}
            className="px-2.5 py-1 bg-[#1F2A27] hover:bg-[#2C3B37] text-[#F2B84B] dark:bg-[#2C2415] dark:text-[#F2B84B] dark:border dark:border-[#F2B84B]/30 rounded-full font-mono text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-sm active:scale-95"
            title="Demo Simulator: Trigger On-the-way slide-in alert"
          >
            <Sparkles className="w-3 h-3 text-[var(--color-marigold)]" />
            <span>Simulate Alert</span>
          </button>
        )}
      </div>

      {/* Horizontal row of 4 pitstop categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {mumbaiPitstopRadar.map((item) => {
          const isJustAdded = addedId === item.id;
          return (
            <div
              key={item.id}
              className="p-2.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl flex items-center justify-between gap-1.5 transition-colors hover:bg-[var(--color-surface)]"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[10px] font-mono font-medium uppercase text-[var(--color-ink-muted)]">
                  {getRadarIcon(item.type)}
                  <span>{item.type}</span>
                </div>
                <div className="font-body font-semibold text-xs text-[var(--color-ink)] truncate mt-0.5">
                  {item.title}
                </div>
                <div className="font-mono text-[10px] text-[var(--color-sage-deep)] font-medium">
                  +{item.distanceOffRouteMeters}m · +{item.detourMinutes}m
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickAddRadar(item)}
                className={`w-7 h-7 shrink-0 rounded-full border border-[var(--color-border)] flex items-center justify-center transition-all cursor-pointer ${
                  isJustAdded
                    ? 'bg-[var(--color-status-success)] text-white border-transparent'
                    : 'bg-[var(--color-surface)] hover:bg-[var(--color-marigold)] hover:text-[#1F2A27] text-[var(--color-ink)]'
                }`}
                title={`Add ${item.title} as quick stop`}
              >
                {isJustAdded ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};