import { useAuthStore } from '../../lib/store';
import { PERMS } from '../permissions';

export default function Access(){
  const user = useAuthStore(s=> s.user);
  const isOwner = user?.roles?.includes('owner');
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Access Control</h2>
      {!isOwner && <div className="text-sm text-red-600">Only Owner can manage roles and admin access.</div>}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 text-sm text-neutral-500">
        Define roles, assign granular permissions (e.g., products:write, orders:manage). Owner can create admins and grant limited access to managers.
        <div className="mt-2 text-xs text-neutral-400">Perms: {Object.values(PERMS).join(', ')}</div>
      </div>
    </div>
  );
}
