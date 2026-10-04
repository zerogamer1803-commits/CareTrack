import { useNavigate } from 'react-router-dom';
import { MapPin, Battery, Watch, AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockPlaceVisits, mockActivityLog } from '../data/mockData';
import type { PlaceVisit } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AlertCard from '../components/ui/AlertCard';
import LiveMap from '../components/map/LiveMap';

function formatSecs(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  return s < 60 ? `${s} sec ago` : `${Math.floor(s / 60)} min ago`;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

function stayDuration(visit: PlaceVisit): string {
  const end = visit.departureTime ?? new Date();
  const mins = Math.round((end.getTime() - visit.arrivalTime.getTime()) / 60000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m.toString().padStart(2, '0')}m` : `${h}h`;
}

const typeColors: Record<string, string> = {
  home: 'bg-emerald-100 text-emerald-700',
  college: 'bg-blue-100 text-blue-700',
  hospital: 'bg-red-100 text-red-700',
  transit: 'bg-orange-100 text-orange-700',
  other: 'bg-slate-100 text-slate-600',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser, safeZones, simulation: { device, location, alerts, activeSos, resolveAlert, markRead } } = useApp();
  const unresolved = alerts.filter(a => !a.resolved);
  const recentResolved = alerts.filter(a => a.resolved).slice(0, 2);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      {/* ── SOS EMERGENCY BANNER ── */}
      {activeSos && (
        <div
          className="bg-red-600 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={26} className="shrink-0 animate-pulse" aria-hidden="true" />
            <div>
              <div className="font-bold text-lg leading-tight">🚨 SOS ALERT — Emergency Assistance Requested</div>
              <div className="text-red-100 text-sm mt-0.5">
                Rahul has requested emergency assistance · {formatTime(new Date())} · Battery {device.battery}%
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap shrink-0">
            <Button
              size="sm"
              className="bg-white text-red-600 hover:bg-red-50 font-semibold"
              onClick={() => navigate('/tracking')}
            >
              View Live Location
            </Button>
            <Button
              size="sm"
              className="border border-white/50 bg-transparent text-white hover:bg-red-700"
              onClick={() => navigate('/alerts')}
            >
              Open Alerts
            </Button>
            <Button
              size="sm"
              className="border border-white/50 bg-transparent text-white hover:bg-red-700"
              onClick={() => { const sos = alerts.find(a => a.type === 'sos' && !a.resolved); if (sos) resolveAlert(sos.id); }}
            >
              Mark Resolved
            </Button>
          </div>
        </div>
      )}

      {/* ── GREETING + SAFETY STATUS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Good {getGreeting()}, {currentUser.name.split(' ')[0]}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" aria-hidden="true" />
            <span className="text-slate-600 text-sm">
              Rahul is currently <span className="text-emerald-600 font-semibold">safe</span>
            </span>
          </div>
        </div>
        {/* No-SOS status pill */}
        {!activeSos && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" aria-hidden="true" />
            No Active SOS
          </div>
        )}
      </div>

      {/* ── 3 STATUS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Location */}
        <Card className="p-4 flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
            <MapPin size={20} className="text-blue-600" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Current Location</div>
            <div className="text-base font-bold text-slate-800 truncate mt-0.5">{location.address}</div>
            <div className="text-xs text-slate-400 mt-0.5">Updated {formatSecs(location.timestamp)}</div>
          </div>
        </Card>

        {/* Battery */}
        <Card className="p-4 flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            device.battery > 50 ? 'bg-emerald-50' : device.battery > 20 ? 'bg-orange-50' : 'bg-red-50'
          }`}>
            <Battery size={20} className={
              device.battery > 50 ? 'text-emerald-600' : device.battery > 20 ? 'text-orange-500' : 'text-red-600'
            } />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Battery</div>
            <div className={`text-base font-bold mt-0.5 ${
              device.battery > 50 ? 'text-emerald-600' : device.battery > 20 ? 'text-orange-500' : 'text-red-600'
            }`}>{device.battery}%</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {device.battery > 50 ? 'Good' : device.battery > 20 ? 'Low — charge soon' : 'Critical'}
            </div>
          </div>
        </Card>

        {/* Device */}
        <Card className="p-4 flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            device.status === 'online' ? 'bg-emerald-50' : 'bg-gray-100'
          }`}>
            <Watch size={20} className={device.status === 'online' ? 'text-emerald-600' : 'text-gray-400'} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Device</div>
            <div className={`text-base font-bold mt-0.5 ${device.status === 'online' ? 'text-emerald-600' : 'text-gray-500'}`}>
              {device.status === 'online' ? 'Online' : 'Offline'}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Last sync {formatSecs(device.lastSync)}</div>
          </div>
        </Card>
      </div>

      {/* ── MAIN CONTENT: MAP + SIDEBAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* LEFT: Map */}
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800">Live Location</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {location.address} · Updated {formatSecs(location.timestamp)}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate('/tracking')}>
                Full View
              </Button>
            </div>
            <LiveMap
              lat={location.lat}
              lng={location.lng}
              safeZones={safeZones}
              height="340px"
              battery={device.battery}
              speed={device.speed}
              lastSync={device.lastSync}
              address={location.address}
            />
          </Card>

          {/* Places Visited Today */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Places Visited Today</h3>
              <Button size="sm" variant="ghost" onClick={() => navigate('/history')}>
                Full History <ChevronRight size={14} />
              </Button>
            </div>
            <div className="space-y-0 divide-y divide-slate-50">
              {mockPlaceVisits.map((visit, i) => (
                <div key={visit.id} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center pt-1 shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${typeColors[visit.type]}`}>
                      {visit.icon}
                    </div>
                    {i < mockPlaceVisits.length - 1 && (
                      <div className="w-px flex-1 bg-slate-100 mt-1 min-h-4" />
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800 text-sm">{visit.name}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                        <Clock size={11} />
                        {stayDuration(visit)}
                        {!visit.departureTime && <span className="text-emerald-600 font-medium ml-0.5">· Here now</span>}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Arrival: {formatTime(visit.arrivalTime)}
                      {visit.departureTime && ` · Departure: ${formatTime(visit.departureTime)}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT: Activity + Alerts */}
        <div className="space-y-5">
          {/* Recent Activity */}
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800 mb-4">Recent Activity</h3>
            <div className="space-y-0">
              {mockActivityLog.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2 first:pt-0 last:pb-0">
                  <div className="flex flex-col items-center shrink-0">
                    <span className="text-base leading-none">{item.icon}</span>
                    {i < mockActivityLog.length - 1 && <div className="w-px h-4 bg-slate-100 mt-1" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-700 leading-snug">{item.text}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{formatTime(item.time)}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Alerts */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800">Alerts</h3>
              <Button size="sm" variant="ghost" onClick={() => navigate('/alerts')}>
                View All <ChevronRight size={14} />
              </Button>
            </div>

            {unresolved.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-600 text-sm py-2 bg-emerald-50 rounded-xl px-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" aria-hidden="true" />
                <span>No active emergencies</span>
              </div>
            ) : (
              <div className="space-y-2">
                {unresolved.slice(0, 2).map(a => (
                  <AlertCard key={a.id} alert={a} compact onMarkRead={markRead} />
                ))}
              </div>
            )}

            {recentResolved.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Previous</p>
                {recentResolved.map(a => (
                  <AlertCard key={a.id} alert={a} compact />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
