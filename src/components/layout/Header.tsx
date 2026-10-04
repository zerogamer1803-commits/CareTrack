import { useState, useRef, useEffect } from 'react';
import { Bell, Menu, AlertTriangle, Shield, Battery, CheckCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Badge from '../ui/Badge';

const typeIcons: Record<string, React.ElementType> = {
  sos: AlertTriangle, safe_zone_exit: Shield, safe_zone_entry: Shield,
  low_battery: Battery, device_offline: Info, device_connected: CheckCircle, system: Info,
};

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const { notifications, markNotificationRead, simulation: { device } } = useApp();
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="bg-white border-b border-slate-100 px-4 lg:px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-xl hover:bg-slate-100" aria-label="Open menu">
          <Menu size={20} className="text-slate-600" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Device status pill */}
        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" aria-hidden="true" />
          <span>{device.status === 'online' ? 'Device Online' : 'Device Offline'}</span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setOpen(v => !v)}
            className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-600"
            aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Notifications</span>
                {unread > 0 && <Badge variant="red">{unread} new</Badge>}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">No notifications</p>
                ) : notifications.map(n => {
                  const Icon = typeIcons[n.type] || Info;
                  return (
                    <button
                      key={n.id}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}
                      onClick={() => { markNotificationRead(n.id); setOpen(false); }}
                    >
                      <div className="flex items-start gap-3">
                        <Icon size={16} className="mt-0.5 text-slate-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-slate-800">{n.title}</span>
                            {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">{n.message}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
