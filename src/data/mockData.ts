import type { Person, Device, Location, SafeZone, Alert, Caregiver, LocationHistory, PlaceVisit } from '../types';

export const mockPerson: Person = {
  id: 'p1',
  name: 'Rahul',
  age: 28,
  emergencyContact: 'Priya Sharma',
  emergencyPhone: '+91 98765 43210',
};

export const mockDevice: Device = {
  id: 'CT-001',
  personId: 'p1',
  battery: 78,
  status: 'online',
  lastSync: new Date(),
  speed: 3,
};

// Current location: Bhapkar BRT, Pune
export const mockLocation: Location = {
  lat: 18.5642,
  lng: 73.7769,
  address: 'Bhapkar BRT',
  timestamp: new Date(),
};

// PVG College of Engineering, Pune
export const PVG_COORDS = { lat: 18.5679, lng: 73.7726 };
// Bhapkar BRT Bus Stop
export const BHAPKAR_COORDS = { lat: 18.5642, lng: 73.7769 };
// Home / My Room
export const HOME_COORDS = { lat: 18.5610, lng: 73.7810 };

export const mockSafeZones: SafeZone[] = [
  { id: 'sz1', name: 'Home', lat: HOME_COORDS.lat, lng: HOME_COORDS.lng, radius: 200, active: true, alertOnExit: true, alertOnEntry: true, icon: '🏠' },
  { id: 'sz2', name: 'PVG College', lat: PVG_COORDS.lat, lng: PVG_COORDS.lng, radius: 300, active: true, alertOnExit: true, alertOnEntry: false, icon: '🎓' },
  { id: 'sz3', name: 'Hospital', lat: 18.5530, lng: 73.7850, radius: 400, active: true, alertOnExit: true, alertOnEntry: false, icon: '🏥' },
];

export const mockAlerts: Alert[] = [
  {
    id: 'a1', type: 'safe_zone_exit', title: 'Safe Zone Alert',
    message: 'Rahul has left the Home safe zone.',
    timestamp: new Date(Date.now() - 86400000),
    read: true, resolved: true, severity: 'high',
  },
  {
    id: 'a2', type: 'low_battery', title: 'Low Battery',
    message: 'Device battery reached 20%.',
    timestamp: new Date(Date.now() - 172800000),
    read: true, resolved: true, severity: 'medium',
  },
  {
    id: 'a3', type: 'device_connected', title: 'Device Connected',
    message: 'CareTrack wearable CT-001 is back online.',
    timestamp: new Date(Date.now() - 3600000),
    read: false, resolved: false, severity: 'info',
  },
];

export const mockCaregivers: Caregiver[] = [
  { id: 'c1', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43210', permission: 'full', active: true, isCurrentUser: true },
  { id: 'c2', name: 'Arun Sharma', email: 'arun@example.com', phone: '+91 98765 11111', permission: 'location_alerts', active: true },
  { id: 'c3', name: 'Neha Sharma', email: 'neha@example.com', phone: '+91 98765 22222', permission: 'location_only', active: true },
];

// Today's route: Home → PVG → Bhapkar BRT → (still here)
export const mockLocationHistory: LocationHistory[] = [
  { timestamp: new Date(new Date().setHours(8, 5, 0, 0)), lat: HOME_COORDS.lat, lng: HOME_COORDS.lng, address: 'My Room', type: 'home' },
  { timestamp: new Date(new Date().setHours(8, 18, 0, 0)), lat: 18.5625, lng: 73.7740, address: 'Road to PVG', type: 'road' },
  { timestamp: new Date(new Date().setHours(8, 20, 0, 0)), lat: PVG_COORDS.lat, lng: PVG_COORDS.lng, address: 'PVG', type: 'college' },
  { timestamp: new Date(new Date().setHours(10, 25, 0, 0)), lat: 18.5660, lng: 73.7748, address: 'PVG Gate', type: 'road' },
  { timestamp: new Date(new Date().setHours(10, 35, 0, 0)), lat: BHAPKAR_COORDS.lat, lng: BHAPKAR_COORDS.lng, address: 'Bhapkar BRT', type: 'road' },
];

/** Places visited today with arrival/departure/stay duration */
export const mockPlaceVisits: PlaceVisit[] = [
  {
    id: 'pv1',
    name: 'My Room',
    address: 'Home',
    type: 'home',
    lat: HOME_COORDS.lat,
    lng: HOME_COORDS.lng,
    arrivalTime: new Date(new Date().setHours(7, 50, 0, 0)),
    departureTime: new Date(new Date().setHours(8, 5, 0, 0)),
    icon: '🏠',
  },
  {
    id: 'pv2',
    name: 'PVG',
    address: 'PVG College of Engineering, Pune',
    type: 'college',
    lat: PVG_COORDS.lat,
    lng: PVG_COORDS.lng,
    arrivalTime: new Date(new Date().setHours(8, 20, 0, 0)),
    departureTime: new Date(new Date().setHours(10, 25, 0, 0)),
    icon: '🎓',
  },
  {
    id: 'pv3',
    name: 'Bhapkar BRT',
    address: 'Bhapkar BRT Bus Stop, Pune',
    type: 'transit',
    lat: BHAPKAR_COORDS.lat,
    lng: BHAPKAR_COORDS.lng,
    arrivalTime: new Date(new Date().setHours(10, 35, 0, 0)),
    departureTime: null, // still here
    icon: '🚌',
  },
];

/** Recent activity feed */
export const mockActivityLog = [
  { time: new Date(new Date().setHours(10, 42, 0, 0)), icon: '📍', text: 'Location updated — Bhapkar BRT' },
  { time: new Date(new Date().setHours(10, 35, 0, 0)), icon: '🚌', text: 'Arrived at Bhapkar BRT' },
  { time: new Date(new Date().setHours(10, 25, 0, 0)), icon: '🎓', text: 'Left PVG' },
  { time: new Date(new Date().setHours(8, 20, 0, 0)), icon: '🎓', text: 'Arrived at PVG' },
  { time: new Date(new Date().setHours(8, 5, 0, 0)), icon: '🏠', text: 'Left My Room' },
];
