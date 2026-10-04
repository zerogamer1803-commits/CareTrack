import type { Alert } from '../../types';
import Badge from './Badge';
import Button from './Button';
import { AlertTriangle, Shield, Battery, Wifi, CheckCircle, Info } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  onResolve?: (id: string) => void;
  onMarkRead?: (id: string) => void;
  onViewLocation?: () => void;
  compact?: boolean;
}

const typeConfig = {
  sos: { icon: AlertTriangle, label: 'SOS Alert', badge: 'red' as const, bg: 'bg-red-50 border-red-200' },
  safe_zone_exit: { icon: Shield, label: 'Safe Zone Alert', badge: 'orange' as const, bg: 'bg-orange-50 border-orange-200' },
  safe_zone_entry: { icon: Shield, label: 'Safe Zone Entry', badge: 'green' as const, bg: 'bg-emerald-50 border-emerald-200' },
  low_battery: { icon: Battery, label: 'Low Battery', badge: 'yellow' as const, bg: 'bg-yellow-50 border-yellow-200' },
  device_offline: { icon: Wifi, label: 'Device Offline', badge: 'gray' as const, bg: 'bg-gray-50 border-gray-200' },
  device_connected: { icon: CheckCircle, label: 'Device Connected', badge: 'green' as const, bg: 'bg-emerald-50 border-emerald-200' },
  system: { icon: Info, label: 'System', badge: 'blue' as const, bg: 'bg-blue-50 border-blue-200' },
};

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function AlertCard({ alert, onResolve, onMarkRead, onViewLocation, compact }: AlertCardProps) {
  const cfg = typeConfig[alert.type];
  const Icon = cfg.icon;

  if (compact) {
    return (
      <div className={`flex items-start gap-3 p-3 rounded-xl border ${cfg.bg} ${!alert.read ? 'ring-1 ring-offset-0' : ''}`}>
        <Icon size={16} className="mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800">{alert.title}</p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{alert.message}</p>
        </div>
        <Badge variant={cfg.badge}>{!alert.read ? 'New' : alert.resolved ? 'Resolved' : 'Active'}</Badge>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl border ${cfg.bg} ${alert.type === 'sos' ? 'border-2' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl ${alert.type === 'sos' ? 'bg-red-100' : 'bg-white/60'}`}>
            <Icon size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-800">{alert.title}</span>
              <Badge variant={cfg.badge}>{alert.resolved ? 'Resolved' : 'Active'}</Badge>
              {!alert.read && <Badge variant="blue">Unread</Badge>}
            </div>
            <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
            <p className="text-xs text-slate-400 mt-1">{formatTime(alert.timestamp)}</p>
          </div>
        </div>
      </div>
      {!alert.resolved && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {onViewLocation && (
            <Button size="sm" variant="outline" onClick={onViewLocation}>View Live Location</Button>
          )}
          {onMarkRead && !alert.read && (
            <Button size="sm" variant="ghost" onClick={() => onMarkRead(alert.id)}>Mark as Read</Button>
          )}
          {onResolve && (
            <Button size="sm" variant="secondary" onClick={() => onResolve(alert.id)}>Mark as Resolved</Button>
          )}
        </div>
      )}
    </div>
  );
}
