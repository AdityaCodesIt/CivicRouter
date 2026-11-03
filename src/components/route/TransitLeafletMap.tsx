import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DeliveryStop } from '../../data/mockStops';

interface TransitLeafletMapProps {
  stops: DeliveryStop[];
  activeStopId?: string;
  onSelectStop?: (stop: DeliveryStop) => void;
  className?: string;
}

export const TransitLeafletMap: React.FC<TransitLeafletMapProps> = ({
  stops,
  activeStopId,
  onSelectStop,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Centered on central Mumbai corridor (Dadar)
      const map = L.map(mapContainerRef.current, {
        center: [19.0178, 72.8428],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // OpenStreetMap Tiles with warm morning filter
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
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

  // Update Pins and Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    if (stops.length === 0) return;

    // Collect coordinates
    const latLngs: L.LatLngExpression[] = stops.map((s) => [
      s.coordinates.lat,
      s.coordinates.lng,
    ]);

    // Active stop index for visited vs upcoming segmentation
    const activeIdx = activeStopId
      ? stops.findIndex((s) => s.id === activeStopId)
      : -1;

    // 1. Draw Polyline
    if (latLngs.length > 1) {
      // Visited route segments (Sage dashed)
      if (activeIdx > 0) {
        const visitedLatLngs = latLngs.slice(0, activeIdx + 1);
        L.polyline(visitedLatLngs, {
          color: '#4F7A66',
          weight: 4,
          opacity: 0.8,
          dashArray: '6, 6',
          lineCap: 'round',
        }).addTo(layerGroup);
      }

      // Upcoming route segments: Ink casing + Marigold center
      const upcomingLatLngs = activeIdx >= 0 ? latLngs.slice(activeIdx) : latLngs;
      if (upcomingLatLngs.length > 1) {
        L.polyline(upcomingLatLngs, {
          color: '#1F2A27',
          weight: 6,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(layerGroup);

        L.polyline(upcomingLatLngs, {
          color: '#F2B84B',
          weight: 3.5,
          opacity: 1,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(layerGroup);
      }
    }

    // 2. Add Current Location Blue Dot with halo
    const firstStop = stops[0];
    if (firstStop) {
      const liveDot = L.divIcon({
        className: 'user-location-halo',
        html: `
          <div style="position: relative; width: 20px; height: 20px;">
            <div style="position: absolute; inset: -4px; border-radius: 50%; background-color: rgba(168, 197, 218, 0.4); animation: pulse 2s infinite;"></div>
            <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #385566; border: 2px solid #FFFDF9; box-shadow: 0 2px 6px rgba(0,0,0,0.15); margin: 4px;"></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      L.marker([firstStop.coordinates.lat + 0.003, firstStop.coordinates.lng - 0.002], {
        icon: liveDot,
        title: 'Your Position',
      }).addTo(layerGroup);
    }

    // 3. Draw Numbered Round Pins
    stops.forEach((stop, idx) => {
      const orderNumber = String(stop.order || idx + 1).padStart(2, '0');
      const isActive = stop.id === activeStopId;
      const isDone = stop.status === 'completed';

      let pinBg = 'background-color: #FFFDF9; color: #1F2A27;';
      let borderStyle = 'border: 2px solid #E6DECF;';

      if (isDone) {
        pinBg = 'background-color: #E4F3EB; color: #3F8F66;';
        borderStyle = 'border: 2px solid #3F8F66;';
      } else if (isActive) {
        pinBg = 'background-color: #F2B84B; color: #1F2A27;';
        borderStyle = 'border: 2px solid #1F2A27; box-shadow: 0 0 0 4px #FBEBC6, 0 4px 12px rgba(60,45,20,0.15);';
      } else if (stop.priority === 'high') {
        pinBg = 'background-color: #FBE1DB; color: #D9604C;';
        borderStyle = 'border: 2px solid #D9604C;';
      }

      const customIcon = L.divIcon({
        className: 'custom-pin-container',
        html: `
          <div class="soft-map-pin ${isActive ? 'active-pin' : ''}" style="${pinBg} ${borderStyle}">
            <span>${orderNumber}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([stop.coordinates.lat, stop.coordinates.lng], {
        icon: customIcon,
        title: `#${stop.order} ${stop.recipientName}`,
      }).addTo(layerGroup);

      // Popup
      const popupHtml = `
        <div style="padding: 12px; font-family: 'Figtree', sans-serif; min-width: 210px; background-color: #FFFDF9;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #E6DECF; padding-bottom: 6px; margin-bottom: 8px;">
            <span style="font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 700; color: #55625D; text-transform: uppercase;">
              STOP #${stop.order || 1} · ${(stop.type || 'drop').toUpperCase()}
            </span>
            <span style="font-family: 'DM Mono', monospace; font-size: 10px; padding: 2px 6px; border-radius: 999px; background-color: ${stop.priority === 'high' ? '#FBE1DB' : '#FBEBC6'}; color: ${stop.priority === 'high' ? '#D9604C' : '#E0A11B'}; font-weight: 700;">
              ${(stop.priority || 'medium').toUpperCase()}
            </span>
          </div>
          <h4 style="font-family: 'Fraunces', serif; font-weight: 700; font-size: 14px; color: #1F2A27; margin: 0 0 4px 0;">
            ${stop.recipientName}
          </h4>
          <p style="font-size: 12px; color: #55625D; margin: 0 0 8px 0; line-height: 1.35;">
            ${stop.address}
          </p>
          <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'DM Mono', monospace; font-size: 11px; padding-top: 6px; border-top: 1px dashed #E6DECF;">
            <span style="color: #1F2A27; font-weight: 600;">ETA: +${stop.etaMinutes}m</span>
            ${stop.deadline ? `<span style="color: #D9604C; font-weight: 600;">by ${stop.deadline}</span>` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectStop?.(stop);
      });
    });

    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, {
        padding: [36, 36],
        maxZoom: 15,
      });
    }
  }, [stops, activeStopId, onSelectStop]);

  return (
    <div className={`relative w-full h-full min-h-[350px] ${className}`}>
      <div
        ref={mapContainerRef}
        className="w-full h-full border border-[#E6DECF] dark:border-[#2B3833] rounded-2xl shadow-warm z-10 overflow-hidden"
        style={{ minHeight: '100%' }}
      />
      {/* Soft Mumbai Morning Radar Tag */}
      <div className="absolute bottom-3 left-3 z-20 bg-[#FFFDF9]/90 dark:bg-[#1C2421]/90 backdrop-blur-sm border border-[#E6DECF] dark:border-[#2B3833] rounded-full px-3 py-1 text-[11px] font-mono text-[#55625D] dark:text-[#95A39D] shadow-warm-sm pointer-events-none flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#F2B84B]" />
        <span>Mumbai Transit Corridor</span>
      </div>
    </div>
  );
};
