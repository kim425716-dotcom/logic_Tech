import { useState } from 'react';
import { FaLock, FaUser } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import type { UserRole } from '../types';

interface SettingsPageProps {
  role: UserRole;
}

export default function SettingsPage({ role }: SettingsPageProps) {
  const { user } = useAuth();
  const { success } = useToast();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    success('Settings saved successfully!');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account preferences.</p>
      </div>

      <Card glass padding="lg">
        <div className="flex items-center gap-4 mb-8">
          <Avatar src={user?.avatarUrl} name={user?.name ?? 'User'} size="lg" ring />
          <div>
            <p className="font-semibold text-white">{user?.name}</p>
            <p className="text-sm text-slate-500 capitalize">{role} account</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Full Name" value={name} onChange={e => setName(e.target.value)}
            leftIcon={<FaUser size={14} />} />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled />
          <Button type="submit" isLoading={loading}>Save Changes</Button>
        </form>
      </Card>

      <Card glass padding="lg">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <FaLock size={14} className="text-violet-400" /> Change Password
        </h2>
        <form onSubmit={e => { e.preventDefault(); success('Password updated!'); }} className="space-y-4">
          <Input label="Current Password" type="password" leftIcon={<FaLock size={14} />} />
          <Input label="New Password" type="password" leftIcon={<FaLock size={14} />} />
          <Button type="submit" variant="outline">Update Password</Button>
        </form>
      </Card>
    </div>
  );
}
