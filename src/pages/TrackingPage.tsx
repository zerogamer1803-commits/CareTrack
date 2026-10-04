import { useState, useRef } from 'react';
import { Crosshair, Navigation, RefreshCw, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LiveMap from '../components/map/LiveMap';
import DeviceStatus from '../components/ui/DeviceStatus';

function formatSecs(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  return s < 60 ? `${s} sec ago` : `${Math.floor(s / 60)} min ago`;
}

export default function TrackingPage() {
  const { safeZones, simulation: { device, location, triggerSos } } = useApp();
  const [follow, setFollow] = useState(false);
  const trailRef = useRef<{ lat: number; lng: number }[]>([]);

  // Accumulate trail points
  const last = trailRef.current[trailRef.current.length - 1];
  if (!last || last.lat !== location.lat || last.lng !== location.lng) {
    trailRef.current = [...trailRef.current.slice(-30), { lat: location.lat, lng: location.lng }];
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* Left panel */}
        <div className="space-y-4">
          {/* Person card */}
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">
                R
              </div>
              <div>
                <div className="font-semibold text-slate-800">Rahul</div>
                <Badge variant="green">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" aria-hidden="true" />
                  Online
                </Badge>
              </div>
            </div>

            <div className="space-y-2.5 text-sm divide-y divide-slate-50">
              <div className="flex justify-between py-1.5 first:pt-0">
                <span className="text-slate-500">Location</span>
                <span className="font-medium text-slate-700 text-right max-w-32 truncate">{location.address}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Battery</span>
                <span className={`font-medium ${device.battery > 30 ? 'text-emerald-600' : device.battery > 15 ? 'text-orange-500' : 'text-red-600'}`}>
                  {device.battery}%
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Speed</span>
                <span className="font-medium text-slate-700">{device.speed.toFixed(1)} km/h</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Last update</span>
                <span className="font-medium text-slate-700">{formatSecs(device.lastSync)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Tracking</span>
                <Badge variant="green">ON</Badge>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button size="sm" variant="outline" className="w-full" onClick={() => {}}>
                <Crosshair size={14} /> Center on Person
              </Button>
              <Button
                size="sm"
                variant={follow ? 'primary' : 'outline'}
                className="w-full"
                onClick={() => setFollow(v => !v)}
              >
                <Navigation size={14} /> {follow ? 'Following' : 'Follow Person'}
              </Button>
              <Button size="sm" variant="secondary" className="w-full" onClick={() => {}}>
                <RefreshCw size={14} /> Refresh Location
              </Button>
            </div>
          </Card>

          {/* Device status */}
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Device Status</h3>
            <DeviceStatus />
          </Card>

          {/* Demo SOS trigger */}
          <Card className="p-4">
            <Button size="sm" variant="danger" className="w-full" onClick={triggerSos}>
              <Zap size={14} /> Simulate SOS Alert
            </Button>
            <p className="text-xs text-slate-400 mt-2 text-center">Demo only — simulates physical SOS button press</p>
          </Card>
        </div>

        {/* Map */}
        <Card className="lg:col-span-3 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-slate-800">Live Location</h3>
              <p className="text-xs text-slate-400 mt-0.5">Simulated GPS · Updates every 5 seconds</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" aria-hidden="true" />
              <span className="text-sm text-emerald-600 font-medium">Live</span>
            </div>
          </div>
          <LiveMap
            lat={location.lat}
            lng={location.lng}
            safeZones={safeZones}
            trail={trailRef.current}
            height="calc(100vh - 260px)"
            battery={device.battery}
            speed={device.speed}
            lastSync={device.lastSync}
            address={location.address}
          />
        </Card>
      </div>
    </div>
  );
}
