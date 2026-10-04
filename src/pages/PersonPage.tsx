import { useState } from 'react';
import { Plus, Edit2, Trash2, Phone, Mail, Shield, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockPerson } from '../data/mockData';
import type { Caregiver } from '../types';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import DeviceStatus from '../components/ui/DeviceStatus';

const permissionLabels: Record<Caregiver['permission'], string> = {
  full: 'Full Access',
  location_alerts: 'Location + Alerts',
  location_only: 'Location Only',
  alerts_only: 'Alerts Only',
};

const permissionBadge: Record<Caregiver['permission'], 'blue' | 'green' | 'orange' | 'gray'> = {
  full: 'blue',
  location_alerts: 'green',
  location_only: 'orange',
  alerts_only: 'gray',
};

const emptyCaregiver: Omit<Caregiver, 'id' | 'isCurrentUser'> = {
  name: '', email: '', phone: '', permission: 'location_only', active: true,
};

export default function PersonPage() {
  const { caregivers, setCaregivers, simulation: { device } } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Caregiver | null>(null);
  const [form, setForm] = useState<Omit<Caregiver, 'id' | 'isCurrentUser'>>(emptyCaregiver);
  const [activeTab, setActiveTab] = useState<'person' | 'caregivers'>('person');

  const openAdd = () => { setEditing(null); setForm(emptyCaregiver); setModalOpen(true); };
  const openEdit = (c: Caregiver) => { setEditing(c); setForm({ name: c.name, email: c.email, phone: c.phone, permission: c.permission, active: c.active }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (editing) {
      setCaregivers(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } : c));
    } else {
      setCaregivers(prev => [...prev, { ...form, id: `c-${Date.now()}` }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => setCaregivers(prev => prev.filter(c => c.id !== id));

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(['person', 'caregivers'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'person' ? 'Person Profile' : 'Caregivers'}
          </button>
        ))}
      </div>

      {activeTab === 'person' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Profile card */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-2xl">
                {mockPerson.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{mockPerson.name}</h2>
                <Badge variant="green">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Online
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Name', value: mockPerson.name },
                { label: 'Age', value: `${mockPerson.age} years` },
                { label: 'Emergency Contact', value: mockPerson.emergencyContact },
                { label: 'Emergency Phone', value: mockPerson.emergencyPhone },
                { label: 'Device ID', value: device.id },
                { label: 'Device Status', value: device.status === 'online' ? 'Online' : 'Offline' },
                { label: 'Battery', value: `${device.battery}%` },
                { label: 'Last Seen', value: 'Just now' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="text-sm font-medium text-slate-800">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit2 size={14} /> Edit Profile
              </Button>
              <Button variant="secondary" size="sm" className="flex-1">
                <Shield size={14} /> Manage Device
              </Button>
            </div>
          </Card>

          {/* Device card */}
          <Card className="p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Device Information</h3>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Device ID', value: device.id },
                { label: 'Model', value: 'CareTrack Wearable v2' },
                { label: 'Firmware', value: 'v2.4.1' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="text-sm font-medium text-slate-800">{value}</span>
                </div>
              ))}
            </div>
            <h4 className="font-medium text-slate-700 mb-3 text-sm">Live Status</h4>
            <DeviceStatus />
          </Card>
        </div>
      )}

      {activeTab === 'caregivers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-sm">{caregivers.length} caregivers registered</p>
            <Button onClick={openAdd}><Plus size={16} /> Add Caregiver</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caregivers.map(c => (
              <Card key={c.id} className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 flex items-center gap-2">
                        {c.name}
                        {c.isCurrentUser && <Badge variant="blue">You</Badge>}
                      </div>
                      <Badge variant={permissionBadge[c.permission]}>{permissionLabels[c.permission]}</Badge>
                    </div>
                  </div>
                  <Badge variant={c.active ? 'green' : 'gray'}>{c.active ? 'Active' : 'Inactive'}</Badge>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail size={13} /><span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone size={13} /><span>{c.phone}</span>
                  </div>
                </div>
                {!c.isCurrentUser && (
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(c)}>
                      <Edit2 size={13} /> Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(c.id)}>
                      <Trash2 size={13} /> Remove
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Caregiver' : 'Add Caregiver'}>
        <div className="space-y-4">
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Arun Sharma' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'arun@example.com' },
            { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 98765 00000' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form] as string}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Permission Level</label>
            <select
              value={form.permission}
              onChange={e => setForm(p => ({ ...p, permission: e.target.value as Caregiver['permission'] }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="full">Full Access</option>
              <option value="location_alerts">Location + Alerts</option>
              <option value="location_only">Location Only</option>
              <option value="alerts_only">Alerts Only</option>
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-slate-700">Active</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave}>
              <User size={14} /> {editing ? 'Save Changes' : 'Add Caregiver'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
