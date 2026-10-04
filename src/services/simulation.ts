import { useState, useEffect, useRef, useCallback } from 'react';
import type { Device, Location, Alert } from '../types';
import { mockDevice, mockLocation, mockAlerts, PVG_COORDS, BHAPKAR_COORDS, HOME_COORDS } from '../data/mockData';

// Simulated route: Home → PVG → Bhapkar BRT → back
// Replace this data source with real GPS backend when available
const ROUTE_WAYPOINTS = [
  { lat: HOME_COORDS.lat, lng: HOME_COORDS.lng, address: 'My Room' },
  { lat: 18.5618, lng: 73.7798, address: 'Near Home' },
  { lat: 18.5625, lng: 73.7775, address: 'Road to PVG' },
  { lat: 18.5640, lng: 73.7755, address: 'Road to PVG' },
  { lat: PVG_COORDS.lat, lng: PVG_COORDS.lng, address: 'PVG' },
  { lat: 18.5672, lng: 73.7735, address: 'PVG Campus' },
  { lat: PVG_COORDS.lat, lng: PVG_COORDS.lng, address: 'PVG' },
  { lat: 18.5660, lng: 73.7748, address: 'PVG Gate' },
  { lat: 18.5652, lng: 73.7758, address: 'Road to BRT' },
  { lat: BHAPKAR_COORDS.lat, lng: BHAPKAR_COORDS.lng, address: 'Bhapkar BRT' },
  { lat: 18.5648, lng: 73.7775, address: 'Near BRT' },
  { lat: 18.5635, lng: 73.7790, address: 'Road Home' },
];

export function useSimulation(enabled = true) {
  const [device, setDevice] = useState<Device>({ ...mockDevice, lastSync: new Date() });
  const [location, setLocation] = useState<Location>({ ...mockLocation, timestamp: new Date() });
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [activeSos, setActiveSos] = useState(false);
  const waypointIndex = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    const now = new Date();
    waypointIndex.current = (waypointIndex.current + 1) % ROUTE_WAYPOINTS.length;
    const wp = ROUTE_WAYPOINTS[waypointIndex.current];
    setLocation({ lat: wp.lat, lng: wp.lng, address: wp.address, timestamp: now });
    setDevice(prev => ({
      ...prev,
      lastSync: now,
      battery: Math.max(10, prev.battery - (Math.random() > 0.9 ? 1 : 0)),
      speed: 2 + Math.random() * 4,
    }));
  }, []);

  useEffect(() => {
    if (!enabled) return;
    intervalRef.current = setInterval(tick, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [enabled, tick]);

  const triggerSos = useCallback(() => {
    const sosAlert: Alert = {
      id: `sos-${Date.now()}`,
      type: 'sos',
      title: 'SOS ALERT',
      message: 'Rahul has requested emergency assistance.',
      timestamp: new Date(),
      read: false,
      resolved: false,
      severity: 'critical',
    };
    setAlerts(prev => [sosAlert, ...prev]);
    setActiveSos(true);
  }, []);

  const resolveAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true, read: true } : a));
    setActiveSos(false);
  }, []);

  const markRead = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  }, []);

  const addAlert = useCallback((alert: Omit<Alert, 'id' | 'timestamp' | 'read' | 'resolved'>) => {
    setAlerts(prev => [{
      ...alert, id: `a-${Date.now()}`, timestamp: new Date(), read: false, resolved: false,
    }, ...prev]);
  }, []);

  return { device, location, alerts, activeSos, triggerSos, resolveAlert, markRead, addAlert };
}
