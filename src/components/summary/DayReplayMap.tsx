import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DeliveryStop } from '../../data/mockStops';
import { Play, Pause, RotateCcw, FastForward, Bike } from 'lucide-react';

interface DayReplayMapProps {
  stops: DeliveryStop[];
  completedStopIds: string[];
  className?: string;
}

export const DayReplayMap: React.FC<DayReplayMapProps> = ({
  stops,
  completedStopIds,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const courierMarkerRef = useRef<L.Marker | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);

  const totalSteps = Math.max(stops.length, 1);
  const activeStop = stops[currentStep] || stops[0];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [19.0178, 72.8428],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
        className: 'leaflet-tile-warm',
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Draw Polylines and Stop Pins
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();
    if (stops.length === 0) return;

    const latLngs: L.LatLngExpression[] = stops.map((s) => [
      s.coordinates.lat,
      s.coordinates.lng,
    ]);

    // 1. Ink outer casing polyline
    L.polyline(latLngs, {
      color: '#1F2A27',
      weight: 5,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(layerGroup);

    // 2. Traveled path vs remaining path
    const traveledLatLngs = latLngs.slice(0, currentStep + 1);
    if (traveledLatLngs.length > 1) {
      // Completed solid route segment in sage
      L.polyline(traveledLatLngs, {
        color: '#4F7A66',
        weight: 3.5,
        opacity: 1,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layerGroup);
    }

    // Remaining segment in dashed marigold
    const remainingLatLngs = latLngs.slice(currentStep);
    if (remainingLatLngs.length > 1) {
      L.polyline(remainingLatLngs, {
        color: '#F2B84B',
        weight: 3,
        opacity: 0.9,
        dashArray: '5, 5',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layerGroup);
    }

    // 3. Stop pins
    stops.forEach((stop, idx) => {
      const isCompleted = completedStopIds.includes(stop.id);
      const isFailed = stop.status === 'skipped' || (stop.notes && stop.notes.includes('[Failed:'));

      let pinBg = '#FFFDF9';
      let pinText = '#1F2A27';
      let borderCol = '#D3C8B4';

      if (isCompleted) {
        pinBg = '#E3EEE6';
        pinText = '#4F7A66';
        borderCol = '#A9C4B0';
      } else if (isFailed) {
        pinBg = '#FBE1DB';
        pinText = '#D9604C';
        borderCol = '#D9604C';
      } else if (idx === currentStep) {
        pinBg = '#F2B84B';
        pinText = '#1F2A27';
        borderCol = '#1F2A27';
      }

      const isCurrentActive = idx === currentStep;
      const pinHtml = `
        <div style="width: 28px; height: 28px; border-radius: 9999px; background-color: ${pinBg}; color: ${pinText}; border: 2px solid ${borderCol}; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-weight: 600; font-size: 11px; box-shadow: 0 2px 6px rgba(60,45,20,0.15); ${isCurrentActive ? 'transform: scale(1.15); ring: 3px solid rgba(242, 184, 75, 0.4);' : ''}">
          ${String(stop.order || idx + 1).padStart(2, '0')}
        </div>
      `;

      const icon = L.divIcon({
        html: pinHtml,
        className: 'transit-pin-wrapper',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker([stop.coordinates.lat, stop.coordinates.lng], { icon })
        .on('click', () => {
          setCurrentStep(idx);
          setIsPlaying(false);
        })
        .addTo(layerGroup);
    });

    // 4. Moving Courier Bike Marker
    if (activeStop) {
      const courierHtml = `
        <div style="width: 34px; height: 34px; border-radius: 9999px; background-color: #F2B84B; border: 2px solid #1F2A27; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(60,45,20,0.25);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F2A27" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18.5" cy="17.5" r="3.5"/>
            <circle cx="5.5" cy="17.5" r="3.5"/>
            <circle cx="15" cy="5" r="1"/>
            <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
          </svg>
        </div>
      `;

      const courierIcon = L.divIcon({
        html: courierHtml,
        className: 'courier-icon-wrapper',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([activeStop.coordinates.lat, activeStop.coordinates.lng], {
        icon: courierIcon,
        zIndexOffset: 1000,
      }).addTo(layerGroup);

      courierMarkerRef.current = marker;

      // Pan gently to follow active stop
      map.panTo([activeStop.coordinates.lat, activeStop.coordinates.lng], {
        animate: true,
        duration: 0.4,
      });
    }

    // Fit bounds on first render
    if (latLngs.length > 0 && currentStep === 0 && !isPlaying) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [36, 36] });
    }
  }, [stops, completedStopIds, currentStep]);

  // Animation Playback Interval
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(2200 / speed, 500);

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= stops.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, speed, stops.length]);

  const handleTogglePlay = () => {
    if (currentStep >= stops.length - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleResetReplay = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleSpeedChange = () => {
    if (speed === 1) setSpeed(2);
    else if (speed === 2) setSpeed(4);
    else setSpeed(1);
  };

  // Replay timestamp calculation
  const getSimulatedTime = (idx: number) => {
    const baseHour = 9;
    const minutes = idx * 28 + 15;
    const hour = baseHour + Math.floor(minutes / 60);
    const minute = minutes % 60;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;
  };

  return (
    <div className={`p-4 sm:p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm ${className}`}>
      {/* Replay Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-3.5 border-b border-[var(--color-border)] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-marigold-tint)] text-[var(--color-ink)] border border-[var(--color-marigold)]/30 flex items-center justify-center">
            <Bike className="w-4 h-4 text-[#8c5e03]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--color-ink)] leading-tight">
              Day Replay & Route Tracing
            </h3>
            <p className="font-body text-xs text-[var(--color-ink-muted)]">
              Interactive timeline of your Mumbai dispatch path
            </p>
          </div>
        </div>

        {/* Speed button & Step counter */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleSpeedChange}
            className="px-2.5 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-sunken)] hover:bg-[var(--color-surface)] font-mono text-xs font-semibold text-[var(--color-ink)] cursor-pointer flex items-center gap-1 transition-colors"
            title="Change Playback Speed"
          >
            <FastForward className="w-3 h-3" />
            <span>{speed}x speed</span>
          </button>

          <div className="font-mono text-xs font-medium bg-[#1F2A27] text-[#F2B84B] dark:bg-[#2C2415] dark:text-[#F2B84B] dark:border dark:border-[#F2B84B]/30 px-2.5 py-1 rounded-full">
            Stop {currentStep + 1} / {totalSteps}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[280px] sm:h-[340px] rounded-xl overflow-hidden border border-[var(--color-border)] mb-3.5">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Active Stop Toast in Bottom Left */}
        {activeStop && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:right-auto sm:max-w-xs z-[1000] p-3 bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)] rounded-xl shadow-md text-xs font-body">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-semibold text-[#8c5e03] uppercase tracking-wide text-[10px]">
                Time: {getSimulatedTime(currentStep)}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-body font-semibold text-[10px] uppercase ${
                  completedStopIds.includes(activeStop.id)
                    ? 'bg-[var(--color-sage-tint)] text-[var(--color-sage-deep)]'
                    : 'bg-[var(--color-priority-high-bg)] text-[var(--color-priority-high)]'
                }`}
              >
                {completedStopIds.includes(activeStop.id) ? 'Delivered' : 'Pending'}
              </span>
            </div>
            <div className="font-body font-semibold text-sm text-[var(--color-ink)] truncate">
              #{activeStop.order}. {activeStop.recipientName}
            </div>
            <div className="text-[11px] text-[var(--color-ink-secondary)] truncate mt-0.5">
              {activeStop.landmark} ({activeStop.area})
            </div>
            {activeStop.codAmount && activeStop.codAmount > 0 ? (
              <div className="mt-1 font-mono font-medium text-[var(--color-sage-deep)] text-[11px]">
                Collected COD: ₹{activeStop.codAmount}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Playback Controls & Scrubber */}
      <div className="p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl">
        {/* Scrubber slider */}
        <div className="mb-2.5">
          <div className="flex items-center justify-between font-mono text-[10px] font-medium text-[var(--color-ink-muted)] mb-1">
            <span>START: DADAR DISPATCH</span>
            <span>DESTINATION: COLABA DOCK</span>
          </div>
          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={currentStep}
            onChange={(e) => {
              setCurrentStep(Number(e.target.value));
              setIsPlaying(false);
            }}
            aria-label="Route Replay Scrubber"
            className="w-full h-2 bg-[var(--color-surface)] rounded-lg appearance-none cursor-pointer border border-[var(--color-border)] accent-[var(--color-marigold)]"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="px-4 py-2 min-h-[40px] rounded-full bg-[var(--color-marigold)] text-[var(--color-ink)] hover:bg-[var(--color-marigold-hover)] font-body font-semibold text-xs uppercase shadow-sm cursor-pointer flex items-center gap-1.5 transition-all active:scale-[0.98]"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 stroke-[2.5]" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 stroke-[2.5]" />
                  <span>{currentStep >= totalSteps - 1 ? 'Replay' : 'Play'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetReplay}
              className="p-2 min-h-[40px] min-w-[40px] rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-bg-sunken)] font-mono text-xs font-semibold shadow-sm cursor-pointer flex items-center justify-center transition-colors"
              title="Reset to Stop 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="font-mono text-xs font-medium text-[var(--color-ink-secondary)]">
            {completedStopIds.length} of {totalSteps} completed
          </div>
        </div>
      </div>
    </div>
  );
};