import { useCallback, useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import SearchBar from '../../components/ui/SearchBar';
import LiveIndicator from '../../components/shared/LiveIndicator';
import { formatDate } from '../../lib/utils';
import { useLiveData } from '../../hooks/useLiveData';
import { getFallbackUsers, LIVE_INTERVALS, loadLiveUsers } from '../../lib/liveData';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(() => loadLiveUsers(), []);
  const { data, loading } = useLiveData(fetchUsers, { intervalMs: LIVE_INTERVALS.lists });
  const allUsers = data?.users ?? getFallbackUsers();

  const filtered = useMemo(() => allUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()),
  ), [allUsers, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-slate-400 text-sm mt-1">{allUsers.length} registered users</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator live={data?.live} />
          {loading && !data && <span className="text-xs text-slate-500">Loading…</span>}
        </div>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search users..." />
      <div className="grid gap-3">
        {filtered.map(user => (
          <Card key={user.id} glass padding="md">
            <div className="flex items-center gap-4">
              <Avatar src={user.avatarUrl} name={user.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-sm text-slate-500 truncate">{user.email}</p>
              </div>
              <Badge label={user.role} variant="purple" />
              {'createdAt' in user && user.createdAt && (
                <span className="text-xs text-slate-600 hidden sm:block">Joined {formatDate(user.createdAt)}</span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
