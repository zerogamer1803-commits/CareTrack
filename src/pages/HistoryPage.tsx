import { useState } from 'react';
import { MapPin, Clock, Navigation, Calendar } from 'lucide-react';
import { mockLocationHistory, mockPlaceVisits } from '../data/mockData';
import type { LocationHistory, PlaceVisit } from '../types';
import Card from '../components/ui/Card';
import HistoryMap from '../components/map/HistoryMap';

type DateRange = 'today' | 'yesterday' | 'week' | 'custom';

const typeIcons: Record<string, string> = {
  home: '🏠', road: '📍', college: '🎓', hospital: '🏥', other: '📌',
};

const typeColors: Record<string, string> = {
  home: 'text-emerald-600 bg-emerald-50',
  college: 'text-blue-600 bg-blue-50',
  hospital: 'text-red-500 bg-red-50',
  transit: 'text-orange-500 bg-orange-50',
  road: 'text-slate-500 bg-slate-50',
  other: 'text-slate-500 bg-slate-50',
};

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function stayDuration(visit: PlaceVisit): string {
  const end = visit.departureTime ?? new Date();
  const mins = Math.round((end.getTime() - visit.arrivalTime.getTime()) / 60000);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m.toString().padStart(2, '0')}m` : `${h}h`;
}

function calcDistance(history: LocationHistory[]): number {
  let total = 0;
  for (let i = 1; i < history.length; i++) {
    const R = 6371;
    const dLat = (history[i].lat - history[i - 1].lat) * Math.PI / 180;
    const dLng = (history[i].lng - history[i - 1].lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(history[i - 1].lat * Math.PI / 180) *
      Math.cos(history[i].lat * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    total += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  return total;
}

export default function HistoryPage() {
  const [range, setRange] = useState<DateRange>('today');
  const history = mockLocationHistory;
  const placeVisits = mockPlaceVisits;

  const distance = calcDistance(history).toFixed(1);
  const travelMins = history.length > 1
    ? Math.round((history[history.length - 1].timestamp.getTime() - history[0].timestamp.getTime()) / 60000)
    : 0;

  const ranges: { key: DateRange; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'week', label: 'Last 7 Days' },
    { key: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Date controls */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={15} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Date Range</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {ranges.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setRange(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                range === key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Navigation, label: 'Total Distance', value: `${distance} km`, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: Clock, label: 'Travel Time', value: `${travelMins} min`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: MapPin, label: 'Places Visited', value: `${placeVisits.length}`, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label} className="p-4 text-center">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <Icon size={18} className={color} />
            </div>
            <div className={`text-xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </Card>
        ))}
      </div>

      {/* Map + Places */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-4">
          <h3 className="font-semibold text-slate-800 mb-4">Route Map</h3>
          <HistoryMap history={history} height="420px" />
        </Card>

        {/* Places visited with stay duration */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-4">Places Visited</h3>
          <div className="space-y-0 divide-y divide-slate-50">
            {placeVisits.map((visit, i) => (
              <div key={visit.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${typeColors[visit.type]}`}>
                    {visit.icon}
                  </div>
                  {i < placeVisits.length - 1 && <div className="w-px h-4 bg-slate-100 mt-1" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm">{visit.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Arrival: {formatTime(visit.arrivalTime)}
                  </div>
                  {visit.departureTime && (
                    <div className="text-xs text-slate-500">
                      Departure: {formatTime(visit.departureTime)}
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={10} className="text-slate-400" />
                    <span className="text-xs font-medium text-slate-600">
                      Stay: {stayDuration(visit)}
                    </span>
                    {!visit.departureTime && (
                      <span className="text-xs text-emerald-600 font-medium">· Here now</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* GPS route timeline */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">GPS Timeline</h4>
            <div className="space-y-0">
              {history.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      item.type === 'home' ? 'bg-emerald-100' :
                      item.type === 'college' ? 'bg-blue-100' :
                      item.type === 'hospital' ? 'bg-red-100' : 'bg-slate-100'
                    }`}>
                      {typeIcons[item.type]}
                    </div>
                    {i < history.length - 1 && <div className="w-px h-4 bg-slate-100 my-0.5" />}
                  </div>
                  <div className="pb-2 flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-700">{item.address}</div>
                    <div className="text-xs text-slate-400">{formatTime(item.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
