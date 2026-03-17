import { useState } from 'react';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/StatusBadge';
import { auditLogs } from '@/data/demo';
import { Shield, Database, Key, Plug, HardDrive, Activity, Bug, Cpu, FlaskConical, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sections = [
  { id: 'overview', label: 'System Overview', icon: Cpu },
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'data-tools', label: 'Data Tools', icon: Database },
  { id: 'logs', label: 'Logs', icon: Activity },
  { id: 'jobs', label: 'Jobs', icon: RotateCcw },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'ai', label: 'AI Controls', icon: FlaskConical },
  { id: 'maintenance', label: 'Maintenance', icon: HardDrive },
  { id: 'experimental', label: 'Experimental', icon: Bug },
];

const integrations = [
  { name: 'RDW Vehicle Registry', status: 'disconnected', key: 'rdw_api_key' },
  { name: 'APK/MOT Provider', status: 'disconnected', key: 'apk_api_key' },
  { name: 'Accounting (e-Boekhouden)', status: 'disconnected', key: 'accounting_key' },
  { name: 'SMTP / Email', status: 'connected', key: 'smtp_credentials' },
  { name: 'WhatsApp Business', status: 'disconnected', key: 'whatsapp_key' },
  { name: 'Telephony / VoIP', status: 'disconnected', key: 'telephony_key' },
  { name: 'Payment Provider', status: 'disconnected', key: 'payment_key' },
  { name: 'Supplier API (AutoParts)', status: 'connected', key: 'supplier_api_key' },
  { name: 'AI Provider (OpenAI)', status: 'disconnected', key: 'ai_api_key' },
  { name: 'Calendar Sync', status: 'disconnected', key: 'calendar_key' },
];

const featureFlags = [
  { name: 'AI Summaries', enabled: false },
  { name: 'WhatsApp Messaging', enabled: false },
  { name: 'Supplier API Ordering', enabled: true },
  { name: 'Customer Portal', enabled: false },
  { name: 'Multi-Location', enabled: false },
  { name: 'Advanced Reporting', enabled: true },
  { name: 'Barcode Scanning', enabled: false },
  { name: 'Digital Signatures', enabled: false },
];

export default function DeveloperPage() {
  const [active, setActive] = useState('overview');

  return (
    <div className="flex h-full bg-[hsl(222,47%,6%)] text-[hsl(210,40%,80%)]">
      {/* Dev sidebar */}
      <div className="w-48 border-r border-[hsl(222,30%,15%)] p-2 space-y-0.5 shrink-0">
        <p className="text-2xs font-mono uppercase tracking-widest text-[hsl(217,91%,60%)] px-2 py-1.5 mb-1">Developer Console</p>
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={cn(
              "flex items-center gap-2 w-full px-2 py-1.5 rounded text-xs transition-fast",
              active === s.id ? "bg-[hsl(222,47%,14%)] text-[hsl(210,40%,95%)]" : "hover:bg-[hsl(222,47%,10%)]"
            )}
          >
            <s.icon className="h-3.5 w-3.5" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {active === 'overview' && (
          <>
            <h2 className="text-sm font-semibold text-[hsl(210,40%,95%)]">System Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Environment', value: 'Production' },
                { label: 'Database', value: 'Connected' },
                { label: 'Version', value: 'v0.1.0-alpha' },
                { label: 'Uptime', value: '14d 6h 32m' },
              ].map(item => (
                <div key={item.label} className="border border-[hsl(222,30%,15%)] rounded p-3 bg-[hsl(222,47%,8%)]">
                  <p className="text-2xs text-[hsl(210,20%,50%)] uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm font-mono font-medium text-[hsl(210,40%,95%)] mt-1">{item.value}</p>
                </div>
              ))}
            </div>
            <h3 className="text-xs font-semibold text-[hsl(210,40%,95%)] mt-4">Feature Flags</h3>
            <div className="border border-[hsl(222,30%,15%)] rounded bg-[hsl(222,47%,8%)] divide-y divide-[hsl(222,30%,15%)]">
              {featureFlags.map(f => (
                <div key={f.name} className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs">{f.name}</span>
                  <span className={`text-xs font-mono ${f.enabled ? 'text-emerald-400' : 'text-[hsl(210,20%,40%)]'}`}>{f.enabled ? 'ON' : 'OFF'}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {active === 'api-keys' && (
          <>
            <h2 className="text-sm font-semibold text-[hsl(210,40%,95%)]">API Keys</h2>
            <div className="border border-[hsl(222,30%,15%)] rounded bg-[hsl(222,47%,8%)] divide-y divide-[hsl(222,30%,15%)]">
              {['AI Provider Key', 'Messaging API Key', 'Accounting API Key', 'Vehicle Data Key', 'Supplier API Keys', 'Webhook Secret'].map(key => (
                <div key={key} className="flex items-center justify-between px-3 py-2.5">
                  <span className="text-xs">{key}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[hsl(210,20%,40%)]">••••••••••••</span>
                    <Button size="sm" variant="outline" className="h-6 text-2xs border-[hsl(222,30%,20%)] bg-transparent text-[hsl(210,40%,70%)] hover:bg-[hsl(222,47%,14%)]">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {active === 'integrations' && (
          <>
            <h2 className="text-sm font-semibold text-[hsl(210,40%,95%)]">Integrations</h2>
            <div className="space-y-2">
              {integrations.map(integ => (
                <div key={integ.name} className="border border-[hsl(222,30%,15%)] rounded p-3 bg-[hsl(222,47%,8%)] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-[hsl(210,40%,90%)]">{integ.name}</p>
                    <p className="text-2xs font-mono text-[hsl(210,20%,40%)]">{integ.key}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={integ.status} />
                    <Button size="sm" variant="outline" className="h-6 text-2xs border-[hsl(222,30%,20%)] bg-transparent text-[hsl(210,40%,70%)] hover:bg-[hsl(222,47%,14%)]">
                      {integ.status === 'connected' ? 'Test' : 'Configure'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {active === 'data-tools' && (
          <>
            <h2 className="text-sm font-semibold text-[hsl(210,40%,95%)]">Data Tools</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Seed Demo Data', 'Import CSV', 'Export Database', 'Reset Sandbox', 'Rebuild Indexes', 'Clear Cache'].map(tool => (
                <Button key={tool} variant="outline" className="h-auto py-3 justify-start border-[hsl(222,30%,20%)] bg-[hsl(222,47%,8%)] text-[hsl(210,40%,80%)] hover:bg-[hsl(222,47%,12%)]">
                  <span className="text-xs">{tool}</span>
                </Button>
              ))}
            </div>
          </>
        )}

        {active === 'logs' && (
          <>
            <h2 className="text-sm font-semibold text-[hsl(210,40%,95%)]">Audit Logs</h2>
            <div className="border border-[hsl(222,30%,15%)] rounded bg-[hsl(222,47%,8%)] divide-y divide-[hsl(222,30%,15%)]">
              {auditLogs.map(log => (
                <div key={log.id} className="px-3 py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[hsl(217,91%,60%)]">{log.action}</span>
                    <span className="text-[hsl(210,20%,50%)]">on {log.entity_type}/{log.entity_id}</span>
                    <span className="text-2xs text-[hsl(210,20%,40%)] ml-auto font-mono">{new Date(log.timestamp).toLocaleString('nl-NL')}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {['jobs', 'security', 'ai', 'maintenance', 'experimental'].includes(active) && (
          <div className="border border-[hsl(222,30%,15%)] rounded bg-[hsl(222,47%,8%)] p-8 text-center">
            <p className="text-xs text-[hsl(210,20%,50%)]">{sections.find(s => s.id === active)?.label} — Module ready for configuration</p>
          </div>
        )}
      </div>
    </div>
  );
}
