import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Lock, Watch, Shield, LogOut, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface ToggleProps { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string; }
function Toggle({ checked, onChange, label, desc }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div>
        <div className="text-sm font-medium text-slate-700">{label}</div>
        {desc && <div className="text-xs text-slate-400 mt-0.5">{desc}</div>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [notifs, setNotifs] = useState({ sos: true, safeZone: true, lowBattery: true, deviceOffline: true, deviceConnected: true });
  const [privacy, setPrivacy] = useState({ locationSharing: true, caregiverAccess: true });
  const [showPass, setShowPass] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: 'account', icon: User, label: 'Account' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'privacy', icon: Shield, label: 'Privacy' },
    { id: 'device', icon: Watch, label: 'Device' },
    { id: 'security', icon: Lock, label: 'Security' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Account */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50">
          <User size={16} className="text-slate-500" />
          <span className="font-semibold text-slate-700">Account</span>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-slate-800">{currentUser.name}</div>
              <div className="text-sm text-slate-500">{currentUser.email}</div>
            </div>
            <Button size="sm" variant="outline" className="ml-auto">Edit Profile</Button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: 'Full Name', value: currentUser.name },
              { label: 'Email Address', value: currentUser.email },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
                <input defaultValue={value}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </div>
          <Button size="sm" onClick={handleSave} className={saved ? 'bg-emerald-600 hover:bg-emerald-700' : ''}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50">
          <Bell size={16} className="text-slate-500" />
          <span className="font-semibold text-slate-700">Notifications</span>
        </div>
        <div className="px-5 py-2">
          <Toggle checked={notifs.sos} onChange={v => setNotifs(p => ({ ...p, sos: v }))} label="SOS Alerts" desc="Receive emergency SOS notifications immediately" />
          <Toggle checked={notifs.safeZone} onChange={v => setNotifs(p => ({ ...p, safeZone: v }))} label="Safe Zone Alerts" desc="Notify when person enters or exits a safe zone" />
          <Toggle checked={notifs.lowBattery} onChange={v => setNotifs(p => ({ ...p, lowBattery: v }))} label="Low Battery" desc="Alert when device battery drops below 20%" />
          <Toggle checked={notifs.deviceOffline} onChange={v => setNotifs(p => ({ ...p, deviceOffline: v }))} label="Device Offline" desc="Notify when wearable loses connection" />
          <Toggle checked={notifs.deviceConnected} onChange={v => setNotifs(p => ({ ...p, deviceConnected: v }))} label="Device Connected" desc="Notify when wearable reconnects" />
        </div>
      </Card>

      {/* Privacy */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50">
          <Shield size={16} className="text-slate-500" />
          <span className="font-semibold text-slate-700">Privacy</span>
        </div>
        <div className="px-5 py-2">
          <Toggle checked={privacy.locationSharing} onChange={v => setPrivacy(p => ({ ...p, locationSharing: v }))} label="Location Sharing" desc="Allow caregivers to view live location" />
          <Toggle checked={privacy.caregiverAccess} onChange={v => setPrivacy(p => ({ ...p, caregiverAccess: v }))} label="Caregiver Access" desc="Allow registered caregivers to receive alerts" />
        </div>
      </Card>

      {/* Device */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50">
          <Watch size={16} className="text-slate-500" />
          <span className="font-semibold text-slate-700">Device</span>
        </div>
        <div className="p-5 space-y-2">
          {[
            { label: 'Device ID', value: 'CT-001' },
            { label: 'Model', value: 'CareTrack Wearable v2' },
            { label: 'Firmware', value: 'v2.4.1' },
            { label: 'Connection', value: 'Online' },
            { label: 'Battery', value: '78%' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-500">{label}</span>
              <span className="text-sm font-medium text-slate-800">{value}</span>
            </div>
          ))}
          <div className="pt-2 flex gap-2">
            <Button size="sm" variant="outline">Sync Device</Button>
            <Button size="sm" variant="secondary">Restart Device</Button>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50">
          <Lock size={16} className="text-slate-500" />
          <span className="font-semibold text-slate-700">Security</span>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-3">Change Password</h4>
            <div className="space-y-3">
              {[
                { key: 'current', label: 'Current Password' },
                { key: 'newPass', label: 'New Password' },
                { key: 'confirm', label: 'Confirm New Password' },
              ].map(({ key, label }) => (
                <div key={key} className="relative">
                  <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={passwords[key as keyof typeof passwords]}
                      onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPass(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={showPass ? 'Hide' : 'Show'}>
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              ))}
              <Button size="sm">Update Password</Button>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <Button variant="danger" size="sm" className="w-full" onClick={() => navigate('/login')}>
              <LogOut size={14} /> Sign Out
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick links */}
      <Card className="overflow-hidden">
        {sections.map(({ id, icon: Icon, label }) => (
          <button key={id} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-3">
              <Icon size={16} className="text-slate-400" />
              <span className="text-sm text-slate-700">{label} Settings</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>
        ))}
      </Card>
    </div>
  );
}
