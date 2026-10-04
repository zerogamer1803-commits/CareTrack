import { useState } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { SafeZone } from '../types';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import LiveMap from '../components/map/LiveMap';

const emptyZone: Omit<SafeZone, 'id'> = {
  name: '', lat: 18.5204, lng: 73.8567, radius: 300,
  active: true, alertOnExit: true, alertOnEntry: false, icon: '📍',
};

export default function SafeZonesPage() {
  const { safeZones, setSafeZones, simulation: { location } } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SafeZone | null>(null);
  const [form, setForm] = useState<Omit<SafeZone, 'id'>>(emptyZone);

  const openAdd = () => { setEditing(null); setForm(emptyZone); setModalOpen(true); };
  const openEdit = (z: SafeZone) => { setEditing(z); setForm({ ...z }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setSafeZones(prev => prev.map(z => z.id === editing.id ? { ...form, id: editing.id } : z));
    } else {
      setSafeZones(prev => [...prev, { ...form, id: `sz-${Date.now()}` }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => setSafeZones(prev => prev.filter(z => z.id !== id));
  const toggleActive = (id: string) => setSafeZones(prev => prev.map(z => z.id === id ? { ...z, active: !z.active } : z));

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-sm">{safeZones.length} zones configured</p>
        <Button onClick={openAdd}><Plus size={16} /> Add Safe Zone</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Zone list */}
        <div className="space-y-3">
          {safeZones.map(zone => (
            <Card key={zone.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{zone.icon}</span>
                  <div>
                    <div className="font-semibold text-slate-800">{zone.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Radius: {zone.radius} m</div>
                  </div>
                </div>
                <Badge variant={zone.active ? 'green' : 'gray'}>{zone.active ? 'Active' : 'Inactive'}</Badge>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span>Exit alert: <span className={zone.alertOnExit ? 'text-emerald-600 font-medium' : 'text-gray-400'}>
                  {zone.alertOnExit ? 'ON' : 'OFF'}
                </span></span>
                <span>Entry alert: <span className={zone.alertOnEntry ? 'text-emerald-600 font-medium' : 'text-gray-400'}>
                  {zone.alertOnEntry ? 'ON' : 'OFF'}
                </span></span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => toggleActive(zone.id)} aria-label={zone.active ? 'Deactivate' : 'Activate'}>
                  {zone.active ? <ToggleRight size={16} className="text-emerald-600" /> : <ToggleLeft size={16} />}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => openEdit(zone)} aria-label="Edit zone">
                  <Edit2 size={14} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(zone.id)} aria-label="Delete zone"
                  className="text-red-500 hover:bg-red-50">
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Map */}
        <Card className="lg:col-span-2 p-4">
          <h3 className="font-semibold text-slate-800 mb-4">Safe Zones Map</h3>
          <LiveMap lat={location.lat} lng={location.lng} safeZones={safeZones} height="500px" />
        </Card>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Safe Zone' : 'Add Safe Zone'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Zone Name</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Home, College" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Latitude</label>
              <input type="number" step="0.0001" value={form.lat}
                onChange={e => setForm(p => ({ ...p, lat: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Longitude</label>
              <input type="number" step="0.0001" value={form.lng}
                onChange={e => setForm(p => ({ ...p, lng: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Radius: {form.radius} m</label>
            <input type="range" min="100" max="2000" step="50" value={form.radius}
              onChange={e => setForm(p => ({ ...p, radius: parseInt(e.target.value) }))}
              className="w-full accent-blue-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Icon</label>
            <div className="flex gap-2 flex-wrap">
              {['🏠', '🎓', '🏥', '🏢', '🛒', '📍'].map(ic => (
                <button key={ic} onClick={() => setForm(p => ({ ...p, icon: ic }))}
                  className={`text-xl p-2 rounded-xl border-2 transition-colors ${form.icon === ic ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {[
              { key: 'active', label: 'Zone Active' },
              { key: 'alertOnExit', label: 'Alert when person exits' },
              { key: 'alertOnEntry', label: 'Alert when person enters' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form[key as keyof typeof form] as boolean}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-700">{label}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave}>Save Zone</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
