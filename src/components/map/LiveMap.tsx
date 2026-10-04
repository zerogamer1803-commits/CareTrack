import { useEffect, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
} from '@vis.gl/react-google-maps';
import type { SafeZone } from '../../types';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

interface LiveMapProps {
  lat: number;
  lng: number;
  safeZones?: SafeZone[];
  trail?: { lat: number; lng: number }[];
  height?: string;
  battery?: number;
  speed?: number;
  lastSync?: Date;
  address?: string;
}

function formatSecs(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  return s < 60 ? `${s} sec ago` : `${Math.floor(s / 60)} min ago`;
}

/** Inner component — has access to the map instance */
function MapContent({ lat, lng, safeZones = [], trail = [], battery, speed, lastSync, address }: Omit<LiveMapProps, 'height'>) {
  const map = useMap();
  const circlesRef = useRef<google.maps.Circle[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  // Pan map to new position
  useEffect(() => {
    if (!map) return;
    map.panTo({ lat, lng });
  }, [map, lat, lng]);

  // Draw trail polyline
  useEffect(() => {
    if (!map) return;
    if (polylineRef.current) polylineRef.current.setMap(null);
    if (trail.length > 1) {
      polylineRef.current = new google.maps.Polyline({
        path: trail.map(p => ({ lat: p.lat, lng: p.lng })),
        strokeColor: '#2563eb',
        strokeOpacity: 0.7,
        strokeWeight: 3,
        map,
      });
    }
    return () => { if (polylineRef.current) polylineRef.current.setMap(null); };
  }, [map, trail]);

  // Draw safe zone circles
  useEffect(() => {
    if (!map) return;
    circlesRef.current.forEach(c => c.setMap(null));
    circlesRef.current = safeZones.filter(z => z.active).map(zone => new google.maps.Circle({
      center: { lat: zone.lat, lng: zone.lng },
      radius: zone.radius,
      strokeColor: '#10b981',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#10b981',
      fillOpacity: 0.08,
      map,
    }));
    return () => { circlesRef.current.forEach(c => c.setMap(null)); };
  }, [map, safeZones]);

  const popupLines = [
    battery !== undefined ? `Battery: ${battery}%` : null,
    speed !== undefined ? `Speed: ${speed.toFixed(1)} km/h` : null,
    lastSync ? `Updated: ${formatSecs(lastSync)}` : null,
    address ? `Location: ${address}` : null,
  ].filter(Boolean);

  return (
    <AdvancedMarker position={{ lat, lng }} title="Rahul's location">
      <div className="relative group">
        <Pin background="#2563eb" borderColor="#1d4ed8" glyphColor="#ffffff" />
        {/* Tooltip on hover */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 pointer-events-none">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-3 min-w-40 text-left">
            <div className="font-semibold text-slate-800 text-sm mb-1">Rahul</div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-emerald-600 text-xs font-medium">Online</span>
            </div>
            {popupLines.map((line, i) => (
              <div key={i} className="text-xs text-slate-500">{line}</div>
            ))}
          </div>
        </div>
      </div>
    </AdvancedMarker>
  );
}

export default function LiveMap({ lat, lng, safeZones, trail, height = '400px', battery, speed, lastSync, address }: LiveMapProps) {
  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }} aria-label="Live location map">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={{ lat, lng }}
          defaultZoom={16}
          mapId="caretrack-live"
          gestureHandling="greedy"
          disableDefaultUI={false}
          style={{ width: '100%', height: '100%' }}
        >
          <MapContent
            lat={lat} lng={lng}
            safeZones={safeZones} trail={trail}
            battery={battery} speed={speed} lastSync={lastSync} address={address}
          />
        </Map>
      </APIProvider>
    </div>
  );
}
