import React, { createContext, useContext, useState } from 'react';
import type { SafeZone, Caregiver } from '../types';
import { mockSafeZones, mockCaregivers } from '../data/mockData';
import { useSimulation } from '../services/simulation';

interface AppContextType {
  currentUser: Caregiver;
  safeZones: SafeZone[];
  caregivers: Caregiver[];
  setSafeZones: React.Dispatch<React.SetStateAction<SafeZone[]>>;
  setCaregivers: React.Dispatch<React.SetStateAction<Caregiver[]>>;
  simulation: ReturnType<typeof useSimulation>;
  notifications: { id: string; title: string; message: string; time: string; read: boolean; type: string }[];
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const simulation = useSimulation(true);
  const [safeZones, setSafeZones] = useState<SafeZone[]>(mockSafeZones);
  const [caregivers, setCaregivers] = useState<Caregiver[]>(mockCaregivers);
  const currentUser = mockCaregivers[0];

  const [notifRead, setNotifRead] = useState<Record<string, boolean>>({});

  const notifications = simulation.alerts.slice(0, 5).map(a => ({
    id: a.id,
    title: a.title,
    message: a.message,
    time: formatRelTime(a.timestamp),
    read: notifRead[a.id] ?? a.read,
    type: a.type,
  }));

  const markNotificationRead = (id: string) => setNotifRead(prev => ({ ...prev, [id]: true }));

  return (
    <AppContext.Provider value={{ currentUser, safeZones, setSafeZones, caregivers, setCaregivers, simulation, notifications, markNotificationRead }}>
      {children}
    </AppContext.Provider>
  );
}

function formatRelTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hour ago`;
  return `${Math.floor(diff / 86400000)} day ago`;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
