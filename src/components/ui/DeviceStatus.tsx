import { Watch, Battery, RefreshCw, Signal } from 'lucide-react';
import { useApp } from '../../context/AppContext';

function formatSecs(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return `${s} sec ago`;
  return `${Math.floor(s / 60)} min ago`;
}

export default function DeviceStatus() {
  const { simulation: { device } } = useApp();
  const online = device.status === 'online';

  return (
    <div className="space-y-0 divide-y divide-slate-50">
      <div className="flex items-center justify-between py-2.5">
        <div className="flex items-center gap-2 text-slate-600">
          <Watch size={15} />
          <span className="text-sm">Device</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-500' : 'bg-gray-400'}`} aria-hidden="true" />
          <span className={`text-sm font-medium ${online ? 'text-emerald-600' : 'text-gray-500'}`}>
            {online ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between py-2.5">
        <div className="flex items-center gap-2 text-slate-600">
          <Signal size={15} />
          <span className="text-sm">GPS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-500' : 'bg-gray-400'}`} aria-hidden="true" />
          <span className={`text-sm font-medium ${online ? 'text-emerald-600' : 'text-gray-500'}`}>
            {online ? 'Active' : 'No Signal'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between py-2.5">
        <div className="flex items-center gap-2 text-slate-600">
          <Battery size={15} />
          <span className="text-sm">Battery</span>
        </div>
        <span className={`text-sm font-medium ${device.battery > 30 ? 'text-emerald-600' : device.battery > 15 ? 'text-orange-500' : 'text-red-600'}`}>
          {device.battery}%
        </span>
      </div>

      <div className="flex items-center justify-between py-2.5">
        <div className="flex items-center gap-2 text-slate-600">
          <RefreshCw size={15} />
          <span className="text-sm">Last Update</span>
        </div>
        <span className="text-sm text-slate-500">{formatSecs(device.lastSync)}</span>
      </div>
    </div>
  );
}
