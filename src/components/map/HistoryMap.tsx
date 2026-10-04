import { useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import type { LocationHistory } from '../../types';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

interface HistoryMapProps {
  history: LocationHistory[];
  height?: string;
}

const typeColors: Record<string, string> = {
  home: '#10b981',
  college: '#2563eb',
  hospital: '#ef4444',
  road: '#94a3b8',
  other: '#94a3b8',
};

const typeIcons: Record<string, string> = {
  home: '🏠', college: '🎓', hospital: '🏥', road: '📍', other: '📌',
};

function HistoryContent({ history }: { history: LocationHistory[] }) {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || history.length === 0) return;
    if (polylineRef.current) polylineRef.current.setMap(null);

    const path = history.map(h => ({ lat: h.lat, lng: h.lng }));
    polylineRef.current = new google.maps.Polyline({
      path,
      strokeColor: '#2563eb',
      strokeOpacity: 0.7,
      strokeWeight: 3,
      map,
    });

    // Fit bounds
    const bounds = new google.maps.LatLngBounds();
    path.forEach(p => bounds.extend(p));
    map.fitBounds(bounds, 40);

    return () => { if (polylineRef.current) polylineRef.current.setMap(null); };
  }, [map, history]);

  return (
    <>
      {history.map((h, i) => {
        const isLast = i === history.length - 1;
        const color = typeColors[h.type] || '#94a3b8';
        const icon = typeIcons[h.type] || '📌';
        return (
          <AdvancedMarker key={i} position={{ lat: h.lat, lng: h.lng }} title={h.address}>
            <div
              style={{
                width: isLast ? 18 : 13,
                height: isLast ? 18 : 13,
                borderRadius: '50%',
                background: isLast ? '#2563eb' : color,
                border: `${isLast ? 3 : 2}px solid white`,
                boxShadow: isLast ? '0 0 0 3px rgba(37,99,235,0.3)' : '0 1px 3px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isLast ? 9 : 7,
              }}
              title={`${icon} ${h.address} — ${h.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`}
            />
          </AdvancedMarker>
        );
      })}
    </>
  );
}

export default function HistoryMap({ history, height = '350px' }: HistoryMapProps) {
  const center = history.length > 0
    ? { lat: history[Math.floor(history.length / 2)].lat, lng: history[Math.floor(history.length / 2)].lng }
    : { lat: 18.5642, lng: 73.7769 };

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }} aria-label="Location history map">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={center}
          defaultZoom={14}
          mapId="caretrack-history"
          gestureHandling="greedy"
          style={{ width: '100%', height: '100%' }}
        >
          <HistoryContent history={history} />
        </Map>
      </APIProvider>
    </div>
  );
}
