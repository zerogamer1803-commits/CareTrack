export interface Person {
  id: string;
  name: string;
  age: number;
  emergencyContact: string;
  emergencyPhone: string;
}

export interface Device {
  id: string;
  personId: string;
  battery: number;
  status: 'online' | 'offline';
  lastSync: Date;
  speed: number;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
  timestamp: Date;
}

export interface SafeZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  active: boolean;
  alertOnExit: boolean;
  alertOnEntry: boolean;
  icon: string;
}

export interface Alert {
  id: string;
  type: 'sos' | 'safe_zone_exit' | 'safe_zone_entry' | 'low_battery' | 'device_offline' | 'device_connected' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  resolved: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
}

export interface Caregiver {
  id: string;
  name: string;
  email: string;
  phone: string;
  permission: 'full' | 'location_alerts' | 'location_only' | 'alerts_only';
  active: boolean;
  isCurrentUser?: boolean;
}

export interface LocationHistory {
  timestamp: Date;
  lat: number;
  lng: number;
  address: string;
  type: 'home' | 'road' | 'college' | 'hospital' | 'other';
}

/** A named place the person visited with arrival, optional departure, and computed stay duration */
export interface PlaceVisit {
  id: string;
  name: string;
  address: string;
  type: 'home' | 'college' | 'hospital' | 'transit' | 'other';
  lat: number;
  lng: number;
  arrivalTime: Date;
  departureTime: Date | null; // null = still here
  icon: string;
}
