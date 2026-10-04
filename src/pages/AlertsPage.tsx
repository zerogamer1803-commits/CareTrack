import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Alert } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AlertCard from '../components/ui/AlertCard';

type FilterType = 'all' | 'sos' | 'safe_zone_exit' | 'low_battery' | 'device_offline' | 'device_connected';
type ReadFilter = 'all' | 'unread' | 'read';

const filterLabels: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'sos', label: 'SOS' },
  { key: 'safe_zone_exit', label: 'Safety' },
  { key: 'low_battery', label: 'Battery' },
  { key: 'device_offline', label: 'Device' },
  { key: 'device_connected', label: 'Connected' },
];

export default function AlertsPage() {
  const navigate = useNavigate();
  const { simulation: { alerts, activeSos, resolveAlert, markRead } } = useApp();
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');

  const filtered = alerts.filter((a: Alert) => {
    const typeMatch = typeFilter === 'all' || a.type === typeFilter ||
      (typeFilter === 'safe_zone_exit' && (a.type === 'safe_zone_exit' || a.type === 'safe_zone_entry')) ||
      (typeFilter === 'device_offline' && (a.type === 'device_offline' || a.type === 'system'));
    const readMatch = readFilter === 'all' || (readFilter === 'unread' && !a.read) || (readFilter === 'read' && a.read);
    return typeMatch && readMatch;
  });

  const activeSosAlert = alerts.find(a => a.type === 'sos' && !a.resolved);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Active SOS banner */}
      {activeSos && activeSosAlert && (
        <div className="bg-red-600 text-white rounded-2xl p-5" role="alert" aria-live="assertive">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={28} className="shrink-0 animate-pulse" />
            <div>
              <div className="font-bold text-xl">🚨 EMERGENCY ALERT</div>
              <div className="text-red-100 text-sm mt-0.5">{activeSosAlert.message}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm mb-4">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-red-200 text-xs">Battery</div>
              <div className="font-semibold mt-0.5">62%</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-red-200 text-xs">Time</div>
              <div className="font-semibold mt-0.5">
                {activeSosAlert.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-red-200 text-xs">Status</div>
              <div className="font-semibold mt-0.5">Active</div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" className="bg-white text-red-600 hover:bg-red-50 font-semibold" onClick={() => navigate('/tracking')}>
              VIEW LIVE LOCATION
            </Button>
            <Button size="sm" className="border border-white/40 bg-transparent text-white hover:bg-red-700">
              CALL EMERGENCY CONTACT
            </Button>
            <Button size="sm" className="border border-white/40 bg-transparent text-white hover:bg-red-700"
              onClick={() => resolveAlert(activeSosAlert.id)}>
              MARK AS RESOLVED
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={15} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Filter by type</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterLabels.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          {(['all', 'unread', 'read'] as ReadFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setReadFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                readFilter === f ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </Card>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-slate-400 text-sm">No alerts match the current filter.</div>
          </Card>
        ) : (
          filtered.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onResolve={resolveAlert}
              onMarkRead={markRead}
              onViewLocation={() => navigate('/tracking')}
            />
          ))
        )}
      </div>
    </div>
  );
}
