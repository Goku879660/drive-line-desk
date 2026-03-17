import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { teamMembers } from '@/data/demo';

export default function TeamPage() {
  return (
    <div className="p-4">
      <div className="mb-3">
        <h1 className="text-lg font-semibold text-foreground">Team & Users</h1>
        <p className="text-xs text-muted-foreground">{teamMembers.length} team members</p>
      </div>
      <DataTable
        data={teamMembers}
        columns={[
          { key: 'name', header: 'Name', render: (t) => <span className="text-xs font-medium">{t.first_name} {t.last_name}</span> },
          { key: 'email', header: 'Email', render: (t) => <span className="text-xs">{t.email}</span> },
          { key: 'role', header: 'Role', render: (t) => <span className="text-xs capitalize">{t.role.replace('_', ' ')}</span> },
          { key: 'active', header: 'Status', render: (t) => <StatusBadge status={t.active ? 'connected' : 'disconnected'} /> },
          { key: 'last_login', header: 'Last Login', render: (t) => <span className="text-xs font-mono">{t.last_login ? new Date(t.last_login).toLocaleDateString('nl-NL') : '—'}</span> },
        ]}
        searchFields={['first_name', 'last_name', 'email', 'role']}
        searchPlaceholder="Search team..."
      />
    </div>
  );
}
