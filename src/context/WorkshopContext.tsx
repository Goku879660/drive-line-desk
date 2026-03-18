import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  appointments as demoAppointments,
  auditLogs as demoAuditLogs,
  communications as demoCommunications,
  customers as demoCustomers,
  inspections as demoInspections,
  invoices as demoInvoices,
  parts as demoParts,
  payments as demoPayments,
  quotes as demoQuotes,
  suppliers as demoSuppliers,
  teamMembers as demoTeamMembers,
  vehicles as demoVehicles,
  workOrders as demoWorkOrders,
} from '@/data/demo';
import type {
  Appointment,
  AuditLog,
  Communication,
  Customer,
  Inspection,
  Invoice,
  Part,
  Payment,
  Quote,
  Supplier,
  TeamMember,
  Vehicle,
  WorkOrder,
} from '@/types';

export interface FeatureFlag {
  name: string;
  enabled: boolean;
}

export interface ApiKeyRecord {
  id: string;
  label: string;
  value: string;
  configured: boolean;
  updatedAt?: string;
}

export interface IntegrationRecord {
  name: string;
  key: string;
  status: 'connected' | 'disconnected' | 'error';
  enabled: boolean;
  lastSync?: string;
  notes?: string;
}

export interface DocumentRecord {
  id: string;
  entity_type: string;
  entity_id: string;
  file_name: string;
  file_type: string;
  category: string;
  created_at: string;
  uploaded_by?: string;
}

export interface JobRecord {
  id: string;
  name: string;
  status: 'queued' | 'running' | 'failed' | 'completed';
  retries: number;
  updatedAt: string;
}

export interface SystemLogRecord {
  id: string;
  message: string;
  level: 'info' | 'success' | 'error';
  source: string;
  timestamp: string;
}

export interface AiControlRecord {
  name: string;
  enabled: boolean;
  usage: number;
  promptPreview: string;
}

export interface SettingSection {
  id: string;
  title: string;
  description: string;
  values: Record<string, string | boolean>;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  route: string;
}

interface WorkshopContextValue {
  customers: Customer[];
  vehicles: Vehicle[];
  appointments: Appointment[];
  workOrders: WorkOrder[];
  quotes: Quote[];
  invoices: Invoice[];
  payments: Payment[];
  parts: Part[];
  suppliers: Supplier[];
  inspections: Inspection[];
  communications: Communication[];
  teamMembers: TeamMember[];
  documents: DocumentRecord[];
  auditLogs: AuditLog[];
  systemLogs: SystemLogRecord[];
  featureFlags: FeatureFlag[];
  apiKeys: ApiKeyRecord[];
  integrations: IntegrationRecord[];
  jobs: JobRecord[];
  aiControls: AiControlRecord[];
  settingsSections: SettingSection[];
  notifications: NotificationItem[];
  debugMode: boolean;
  getCustomer: (id: string) => Customer | undefined;
  getVehicle: (id: string) => Vehicle | undefined;
  getTeamMember: (id: string) => TeamMember | undefined;
  getVehiclesForCustomer: (customerId: string) => Vehicle[];
  getAppointmentsForCustomer: (customerId: string) => Appointment[];
  getWorkOrdersForCustomer: (customerId: string) => WorkOrder[];
  getInvoicesForCustomer: (customerId: string) => Invoice[];
  addCustomer: (payload: Partial<Customer>) => Customer;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  addVehicle: (payload: Partial<Vehicle>) => Vehicle;
  updateVehicle: (id: string, patch: Partial<Vehicle>) => void;
  addAppointment: (payload: Partial<Appointment>) => Appointment;
  updateAppointment: (id: string, patch: Partial<Appointment>) => void;
  addWorkOrder: (payload: Partial<WorkOrder>) => WorkOrder;
  updateWorkOrder: (id: string, patch: Partial<WorkOrder>) => void;
  addInspection: (payload: Partial<Inspection>) => Inspection;
  updateInspection: (id: string, patch: Partial<Inspection>) => void;
  addPart: (payload: Partial<Part>) => Part;
  updatePart: (id: string, patch: Partial<Part>) => void;
  addSupplier: (payload: Partial<Supplier>) => Supplier;
  updateSupplier: (id: string, patch: Partial<Supplier>) => void;
  addQuote: (payload: Partial<Quote>) => Quote;
  updateQuote: (id: string, patch: Partial<Quote>) => void;
  addInvoice: (payload: Partial<Invoice>) => Invoice;
  updateInvoice: (id: string, patch: Partial<Invoice>) => void;
  addPayment: (payload: Partial<Payment>) => Payment;
  updatePayment: (id: string, patch: Partial<Payment>) => void;
  addCommunication: (payload: Partial<Communication>) => Communication;
  updateCommunication: (id: string, patch: Partial<Communication>) => void;
  addDocument: (payload: Partial<DocumentRecord>) => DocumentRecord;
  updateDocument: (id: string, patch: Partial<DocumentRecord>) => void;
  addTeamMember: (payload: Partial<TeamMember>) => TeamMember;
  updateTeamMember: (id: string, patch: Partial<TeamMember>) => void;
  toggleFeatureFlag: (name: string) => void;
  saveApiKey: (id: string, value: string) => void;
  updateIntegration: (name: string, patch: Partial<IntegrationRecord>) => void;
  testIntegration: (name: string) => void;
  syncIntegration: (name: string) => void;
  seedDemoData: () => void;
  resetDemoData: () => void;
  importCsvData: (raw: string) => void;
  downloadSnapshot: () => void;
  runJob: (id: string) => void;
  retryJob: (id: string) => void;
  toggleAiControl: (name: string) => void;
  setDebugMode: (enabled: boolean) => void;
  saveSettingSection: (id: string, values: Record<string, string | boolean>) => void;
  runMaintenanceAction: (action: string) => void;
}

const featureFlagSeed: FeatureFlag[] = [
  { name: 'AI Summaries', enabled: false },
  { name: 'WhatsApp Messaging', enabled: false },
  { name: 'Supplier API Ordering', enabled: true },
  { name: 'Customer Portal', enabled: false },
  { name: 'Multi-Location', enabled: false },
  { name: 'Advanced Reporting', enabled: true },
  { name: 'Barcode Scanning', enabled: false },
  { name: 'Digital Signatures', enabled: false },
];

const apiKeySeed: ApiKeyRecord[] = [
  { id: 'ai_provider', label: 'AI Provider Key', value: '', configured: false },
  { id: 'messaging_api', label: 'Messaging API Key', value: '', configured: false },
  { id: 'accounting_api', label: 'Accounting API Key', value: '', configured: false },
  { id: 'vehicle_data', label: 'Vehicle Data Key', value: '', configured: false },
  { id: 'supplier_api', label: 'Supplier API Keys', value: 'sup_live_demo_4821', configured: true, updatedAt: new Date().toISOString() },
  { id: 'webhook_secret', label: 'Webhook Secret', value: '', configured: false },
];

const integrationSeed: IntegrationRecord[] = [
  { name: 'RDW Vehicle Registry', status: 'disconnected', key: 'rdw_api_key', enabled: false },
  { name: 'APK/MOT Provider', status: 'disconnected', key: 'apk_api_key', enabled: false },
  { name: 'Accounting (e-Boekhouden)', status: 'disconnected', key: 'accounting_key', enabled: false },
  { name: 'SMTP / Email', status: 'connected', key: 'smtp_credentials', enabled: true, lastSync: new Date().toISOString(), notes: 'Primary outbound email channel enabled.' },
  { name: 'WhatsApp Business', status: 'disconnected', key: 'whatsapp_key', enabled: false },
  { name: 'Telephony / VoIP', status: 'disconnected', key: 'telephony_key', enabled: false },
  { name: 'Payment Provider', status: 'disconnected', key: 'payment_key', enabled: false },
  { name: 'Supplier API (AutoParts)', status: 'connected', key: 'supplier_api_key', enabled: true, lastSync: new Date().toISOString(), notes: 'Inventory sync active every 2 hours.' },
  { name: 'AI Provider (OpenAI)', status: 'disconnected', key: 'ai_api_key', enabled: false },
  { name: 'Calendar Sync', status: 'disconnected', key: 'calendar_key', enabled: false },
];

const jobSeed: JobRecord[] = [
  { id: 'job-1', name: 'Nightly invoice reminder run', status: 'completed', retries: 0, updatedAt: new Date().toISOString() },
  { id: 'job-2', name: 'Supplier stock sync', status: 'queued', retries: 0, updatedAt: new Date().toISOString() },
  { id: 'job-3', name: 'Vehicle registry refresh', status: 'failed', retries: 2, updatedAt: new Date().toISOString() },
];

const aiControlSeed: AiControlRecord[] = [
  { name: 'Communication summaries', enabled: false, usage: 1240, promptPreview: 'Summarize customer conversations into short service updates.' },
  { name: 'Repair note cleanup', enabled: true, usage: 980, promptPreview: 'Rewrite technician notes into customer-friendly language.' },
  { name: 'Inspection follow-up drafting', enabled: false, usage: 420, promptPreview: 'Draft follow-up tasks from advisories and failed checklist items.' },
];

const settingsSeed: SettingSection[] = [
  {
    id: 'garage-info',
    title: 'Garage Info',
    description: 'Primary workshop profile used across documents and reminders.',
    values: {
      garage_name: 'WorkshopOS Garage',
      phone: '020-1234567',
      email: 'service@workshopos.nl',
      city: 'Amsterdam',
    },
  },
  {
    id: 'branding-logo',
    title: 'Branding & Logo',
    description: 'Document footer, brand signature and print identity.',
    values: {
      brand_name: 'WorkshopOS',
      logo_url: '/placeholder.svg',
      accent_tagline: 'Operational clarity for busy workshops',
    },
  },
  {
    id: 'invoice-settings',
    title: 'Invoice Settings',
    description: 'Numbering and defaults for outgoing invoices.',
    values: {
      invoice_prefix: 'INV',
      quote_prefix: 'QT',
      work_order_prefix: 'WO',
      default_terms_days: '14',
    },
  },
  {
    id: 'tax-vat',
    title: 'Tax & VAT',
    description: 'Regional tax settings for billing.',
    values: {
      default_tax_rate: '21',
      vat_number: 'NL000000000B01',
      currency: 'EUR',
      locale: 'nl-NL',
    },
  },
  {
    id: 'opening-hours',
    title: 'Opening Hours',
    description: 'Used for booking suggestions and confirmations.',
    values: {
      weekdays: '08:00 - 17:30',
      saturday: '09:00 - 13:00',
      sunday_closed: true,
    },
  },
  {
    id: 'notification-preferences',
    title: 'Notification Preferences',
    description: 'Customer reminder and internal alert behavior.',
    values: {
      appointment_reminders: true,
      payment_reminders: true,
      stock_alerts: true,
      email_sender_name: 'WorkshopOS Service',
    },
  },
  {
    id: 'document-templates',
    title: 'Document Templates',
    description: 'Print and export wording defaults.',
    values: {
      invoice_footer: 'Thank you for your business.',
      quote_footer: 'This quote remains valid for 14 days.',
      work_order_footer: 'Vehicle left at owner risk outside opening hours.',
    },
  },
  {
    id: 'payment-terms',
    title: 'Payment Terms',
    description: 'Default payment wording and policy text.',
    values: {
      payment_policy: 'Payment due within 14 days unless agreed otherwise.',
      cash_allowed: true,
      card_allowed: true,
      bank_transfer_allowed: true,
    },
  },
];

const documentSeed: DocumentRecord[] = [
  { id: 'doc-1', entity_type: 'vehicle', entity_id: 'v1', file_name: 'apk-report-golf.pdf', file_type: 'pdf', category: 'Inspection', created_at: new Date().toISOString(), uploaded_by: 'u2' },
  { id: 'doc-2', entity_type: 'invoice', entity_id: 'inv2', file_name: 'invoice-inv-2024-0044.pdf', file_type: 'pdf', category: 'Invoice', created_at: new Date().toISOString(), uploaded_by: 'u6' },
  { id: 'doc-3', entity_type: 'work_order', entity_id: 'wo4', file_name: 'timing-belt-photos.zip', file_type: 'zip', category: 'Workshop Photos', created_at: new Date().toISOString(), uploaded_by: 'u3' },
];

const systemLogSeed: SystemLogRecord[] = [
  { id: 'log-1', message: 'WorkshopOS demo state initialized.', level: 'success', source: 'system', timestamp: new Date().toISOString() },
  { id: 'log-2', message: 'Supplier sync queue contains 1 pending job.', level: 'info', source: 'jobs', timestamp: new Date().toISOString() },
  { id: 'log-3', message: 'Developer tools loaded successfully.', level: 'info', source: 'developer', timestamp: new Date().toISOString() },
];

const WorkshopContext = createContext<WorkshopContextValue | null>(null);

const clone = <T,>(data: T): T => JSON.parse(JSON.stringify(data));
const nowIso = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export const toDateInputValue = (iso?: string) => {
  if (!iso) return '';
  const date = new Date(iso);
  const normalized = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return normalized.toISOString().slice(0, 10);
};

export const toDateTimeLocalValue = (iso?: string) => {
  if (!iso) return '';
  const date = new Date(iso);
  const normalized = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return normalized.toISOString().slice(0, 16);
};

export const fromDateInputValue = (value: string) => (value ? new Date(`${value}T12:00:00`).toISOString() : nowIso());
export const fromDateTimeLocalValue = (value: string) => (value ? new Date(value).toISOString() : nowIso());

const maskSecret = (value: string) => (value ? `${'•'.repeat(Math.max(8, Math.min(12, value.length)))}${value.slice(-4)}` : 'Not configured');
export const formatSecretPreview = maskSecret;

export function WorkshopProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(() => clone(demoCustomers));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => clone(demoVehicles));
  const [appointments, setAppointments] = useState<Appointment[]>(() => clone(demoAppointments));
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => clone(demoWorkOrders));
  const [quotes, setQuotes] = useState<Quote[]>(() => clone(demoQuotes));
  const [invoices, setInvoices] = useState<Invoice[]>(() => clone(demoInvoices));
  const [payments, setPayments] = useState<Payment[]>(() => clone(demoPayments));
  const [parts, setParts] = useState<Part[]>(() => clone(demoParts));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => clone(demoSuppliers));
  const [inspections, setInspections] = useState<Inspection[]>(() => clone(demoInspections));
  const [communications, setCommunications] = useState<Communication[]>(() => clone(demoCommunications));
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => clone(demoTeamMembers));
  const [documents, setDocuments] = useState<DocumentRecord[]>(() => clone(documentSeed));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => clone(demoAuditLogs).reverse());
  const [systemLogs, setSystemLogs] = useState<SystemLogRecord[]>(() => clone(systemLogSeed));
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(() => clone(featureFlagSeed));
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>(() => clone(apiKeySeed));
  const [integrations, setIntegrations] = useState<IntegrationRecord[]>(() => clone(integrationSeed));
  const [jobs, setJobs] = useState<JobRecord[]>(() => clone(jobSeed));
  const [aiControls, setAiControls] = useState<AiControlRecord[]>(() => clone(aiControlSeed));
  const [settingsSections, setSettingsSections] = useState<SettingSection[]>(() => clone(settingsSeed));
  const [debugMode, setDebugModeState] = useState(false);

  const appendAudit = (entityType: string, entityId: string, action: string, newValues?: Record<string, unknown>) => {
    const entry: AuditLog = {
      id: uid('audit'),
      user_id: 'u1',
      entity_type: entityType,
      entity_id: entityId,
      action,
      new_values: newValues,
      timestamp: nowIso(),
    };
    setAuditLogs((prev) => [entry, ...prev].slice(0, 80));
  };

  const appendSystemLog = (message: string, source: string, level: 'info' | 'success' | 'error' = 'info') => {
    const entry: SystemLogRecord = {
      id: uid('log'),
      message,
      source,
      level,
      timestamp: nowIso(),
    };
    setSystemLogs((prev) => [entry, ...prev].slice(0, 80));
  };

  const getCustomer = (id: string) => customers.find((item) => item.id === id);
  const getVehicle = (id: string) => vehicles.find((item) => item.id === id);
  const getTeamMember = (id: string) => teamMembers.find((item) => item.id === id);
  const getVehiclesForCustomer = (customerId: string) => vehicles.filter((item) => item.customer_id === customerId);
  const getAppointmentsForCustomer = (customerId: string) => appointments.filter((item) => item.customer_id === customerId);
  const getWorkOrdersForCustomer = (customerId: string) => workOrders.filter((item) => item.customer_id === customerId);
  const getInvoicesForCustomer = (customerId: string) => invoices.filter((item) => item.customer_id === customerId);

  const notifications = useMemo<NotificationItem[]>(() => {
    const expiringVehicle = vehicles.find((vehicle) => {
      if (!vehicle.apk_expiry) return false;
      const diff = (new Date(vehicle.apk_expiry).getTime() - Date.now()) / 86400000;
      return diff <= 30;
    });
    const lowStockPart = parts.find((part) => part.stock_quantity <= part.min_stock_level);
    const overdueInvoice = invoices.find((invoice) => invoice.balance_due > 0 && invoice.status === 'overdue');
    const plannedAppointment = appointments.find((appointment) => appointment.status === 'planned');

    return [
      plannedAppointment && {
        id: 'notif-planned',
        title: 'Planned appointment needs review',
        description: `${getVehicle(plannedAppointment.vehicle_id)?.license_plate || 'Vehicle'} is still marked as planned.`,
        route: '/calendar',
      },
      expiringVehicle && {
        id: 'notif-apk',
        title: 'APK expiry approaching',
        description: `${expiringVehicle.license_plate} needs attention soon.`,
        route: '/vehicles',
      },
      lowStockPart && {
        id: 'notif-stock',
        title: 'Low stock detected',
        description: `${lowStockPart.description} reached the minimum stock threshold.`,
        route: '/parts',
      },
      overdueInvoice && {
        id: 'notif-invoice',
        title: 'Overdue invoice requires follow-up',
        description: `${overdueInvoice.invoice_number} still has an open balance.`,
        route: '/invoices',
      },
    ].filter(Boolean) as NotificationItem[];
  }, [appointments, invoices, parts, vehicles]);

  const addCustomer = (payload: Partial<Customer>) => {
    const record: Customer = {
      id: uid('customer'),
      type: (payload.type as Customer['type']) || 'private',
      first_name: payload.first_name || 'New',
      last_name: payload.last_name || 'Customer',
      email: payload.email || '',
      phone: payload.phone || '',
      company_name: payload.company_name,
      address: payload.address,
      postal_code: payload.postal_code,
      city: payload.city,
      country: payload.country || 'NL',
      vat_number: payload.vat_number,
      kvk_number: payload.kvk_number,
      notes: payload.notes,
      marketing_opt_in: payload.marketing_opt_in ?? false,
      preferred_contact_method: payload.preferred_contact_method,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    setCustomers((prev) => [record, ...prev]);
    appendAudit('customer', record.id, 'created', { name: `${record.first_name} ${record.last_name}` });
    appendSystemLog(`Customer ${record.first_name} ${record.last_name} created.`, 'customers', 'success');
    return record;
  };

  const updateCustomer = (id: string, patch: Partial<Customer>) => {
    setCustomers((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch, updated_at: nowIso() } : item)));
    appendAudit('customer', id, 'updated', patch as Record<string, unknown>);
    appendSystemLog(`Customer ${id} updated.`, 'customers', 'success');
  };

  const addVehicle = (payload: Partial<Vehicle>) => {
    const record: Vehicle = {
      id: uid('vehicle'),
      customer_id: payload.customer_id || customers[0]?.id || '',
      license_plate: payload.license_plate || 'NEW-000',
      vin: payload.vin,
      make: payload.make || 'Unknown',
      model: payload.model || 'Model',
      year: Number(payload.year || new Date().getFullYear()),
      fuel_type: (payload.fuel_type as Vehicle['fuel_type']) || 'petrol',
      transmission: (payload.transmission as Vehicle['transmission']) || 'manual',
      mileage: Number(payload.mileage || 0),
      color: payload.color,
      apk_expiry: payload.apk_expiry,
      last_service_date: payload.last_service_date,
      notes: payload.notes,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    setVehicles((prev) => [record, ...prev]);
    appendAudit('vehicle', record.id, 'created', { license_plate: record.license_plate });
    appendSystemLog(`Vehicle ${record.license_plate} added.`, 'vehicles', 'success');
    return record;
  };

  const updateVehicle = (id: string, patch: Partial<Vehicle>) => {
    setVehicles((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch, updated_at: nowIso() } : item)));
    appendAudit('vehicle', id, 'updated', patch as Record<string, unknown>);
    appendSystemLog(`Vehicle ${id} updated.`, 'vehicles', 'success');
  };

  const addAppointment = (payload: Partial<Appointment>) => {
    const start = payload.scheduled_start || nowIso();
    const end = payload.scheduled_end || new Date(new Date(start).getTime() + 60 * 60 * 1000).toISOString();
    const record: Appointment = {
      id: uid('appt'),
      customer_id: payload.customer_id || customers[0]?.id || '',
      vehicle_id: payload.vehicle_id || vehicles[0]?.id || '',
      scheduled_start: start,
      scheduled_end: end,
      appointment_type: payload.appointment_type || 'Service',
      complaint_description: payload.complaint_description,
      internal_notes: payload.internal_notes,
      assigned_mechanic_id: payload.assigned_mechanic_id,
      status: (payload.status as Appointment['status']) || 'planned',
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    setAppointments((prev) => [record, ...prev]);
    appendAudit('appointment', record.id, 'created', { status: record.status });
    appendSystemLog(`Appointment created for ${getVehicle(record.vehicle_id)?.license_plate || 'vehicle'}.`, 'appointments', 'success');
    return record;
  };

  const updateAppointment = (id: string, patch: Partial<Appointment>) => {
    setAppointments((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch, updated_at: nowIso() } : item)));
    appendAudit('appointment', id, 'updated', patch as Record<string, unknown>);
    appendSystemLog(`Appointment ${id} updated.`, 'appointments', 'success');
  };

  const addWorkOrder = (payload: Partial<WorkOrder>) => {
    const number = payload.work_order_number || `WO-${new Date().getFullYear()}-${String(workOrders.length + 24).padStart(4, '0')}`;
    const record: WorkOrder = {
      id: uid('wo'),
      work_order_number: number,
      customer_id: payload.customer_id || customers[0]?.id || '',
      vehicle_id: payload.vehicle_id || vehicles[0]?.id || '',
      appointment_id: payload.appointment_id,
      intake_notes: payload.intake_notes,
      diagnosis_notes: payload.diagnosis_notes,
      technician_notes: payload.technician_notes,
      internal_notes: payload.internal_notes,
      status: (payload.status as WorkOrder['status']) || 'draft',
      priority: (payload.priority as WorkOrder['priority']) || 'normal',
      assigned_technician_id: payload.assigned_technician_id,
      promised_date: payload.promised_date,
      actual_completion_date: payload.actual_completion_date,
      invoice_id: payload.invoice_id,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    setWorkOrders((prev) => [record, ...prev]);
    appendAudit('work_order', record.id, 'created', { work_order_number: number });
    appendSystemLog(`Work order ${number} created.`, 'work-orders', 'success');
    return record;
  };

  const updateWorkOrder = (id: string, patch: Partial<WorkOrder>) => {
    setWorkOrders((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch, updated_at: nowIso() } : item)));
    appendAudit('work_order', id, 'updated', patch as Record<string, unknown>);
    appendSystemLog(`Work order ${id} updated.`, 'work-orders', 'success');
  };

  const addInspection = (payload: Partial<Inspection>) => {
    const record: Inspection = {
      id: uid('insp'),
      vehicle_id: payload.vehicle_id || vehicles[0]?.id || '',
      work_order_id: payload.work_order_id,
      result: (payload.result as Inspection['result']) || 'advisory',
      advisories: payload.advisories || [],
      defects: payload.defects || [],
      signed_by: payload.signed_by,
      signed_at: payload.signed_at,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    setInspections((prev) => [record, ...prev]);
    appendAudit('inspection', record.id, 'created', { result: record.result });
    appendSystemLog(`Inspection created for ${getVehicle(record.vehicle_id)?.license_plate || 'vehicle'}.`, 'inspections', 'success');
    return record;
  };

  const updateInspection = (id: string, patch: Partial<Inspection>) => {
    setInspections((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch, updated_at: nowIso() } : item)));
    appendAudit('inspection', id, 'updated', patch as Record<string, unknown>);
    appendSystemLog(`Inspection ${id} updated.`, 'inspections', 'success');
  };

  const addPart = (payload: Partial<Part>) => {
    const record: Part = {
      id: uid('part'),
      sku: payload.sku || `PART-${parts.length + 1}`,
      brand: payload.brand || 'Generic',
      description: payload.description || 'New part',
      category: payload.category || 'General',
      supplier_id: payload.supplier_id,
      purchase_price: Number(payload.purchase_price || 0),
      sale_price: Number(payload.sale_price || 0),
      stock_quantity: Number(payload.stock_quantity || 0),
      min_stock_level: Number(payload.min_stock_level || 0),
      location: payload.location,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    setParts((prev) => [record, ...prev]);
    appendAudit('part', record.id, 'created', { sku: record.sku });
    appendSystemLog(`Part ${record.sku} added to inventory.`, 'parts', 'success');
    return record;
  };

  const updatePart = (id: string, patch: Partial<Part>) => {
    setParts((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch, updated_at: nowIso() } : item)));
    appendAudit('part', id, 'updated', patch as Record<string, unknown>);
    appendSystemLog(`Part ${id} updated.`, 'parts', 'success');
  };

  const addSupplier = (payload: Partial<Supplier>) => {
    const record: Supplier = {
      id: uid('supplier'),
      name: payload.name || 'New supplier',
      contact_name: payload.contact_name,
      email: payload.email,
      phone: payload.phone,
      ordering_method: payload.ordering_method,
      delivery_terms: payload.delivery_terms,
      connection_status: payload.connection_status || 'disconnected',
      notes: payload.notes,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    setSuppliers((prev) => [record, ...prev]);
    appendAudit('supplier', record.id, 'created', { name: record.name });
    appendSystemLog(`Supplier ${record.name} added.`, 'suppliers', 'success');
    return record;
  };

  const updateSupplier = (id: string, patch: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch, updated_at: nowIso() } : item)));
    appendAudit('supplier', id, 'updated', patch as Record<string, unknown>);
    appendSystemLog(`Supplier ${id} updated.`, 'suppliers', 'success');
  };

  const addQuote = (payload: Partial<Quote>) => {
    const total = Number(payload.total || 0);
    const subtotal = payload.subtotal ?? Number((total / 1.21).toFixed(2));
    const tax = payload.tax ?? Number((total - subtotal).toFixed(2));
    const record: Quote = {
      id: uid('quote'),
      quote_number: payload.quote_number || `QT-${new Date().getFullYear()}-${String(quotes.length + 12).padStart(4, '0')}`,
      customer_id: payload.customer_id || customers[0]?.id || '',
      vehicle_id: payload.vehicle_id || vehicles[0]?.id || '',
      linked_work_order_id: payload.linked_work_order_id,
      subtotal: Number(subtotal),
      tax: Number(tax),
      total,
      validity_date: payload.validity_date || nowIso(),
      status: (payload.status as Quote['status']) || 'draft',
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    setQuotes((prev) => [record, ...prev]);
    appendAudit('quote', record.id, 'created', { quote_number: record.quote_number });
    appendSystemLog(`Quote ${record.quote_number} created.`, 'quotes', 'success');
    return record;
  };

  const updateQuote = (id: string, patch: Partial<Quote>) => {
    setQuotes((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch, updated_at: nowIso() } : item)));
    appendAudit('quote', id, 'updated', patch as Record<string, unknown>);
    appendSystemLog(`Quote ${id} updated.`, 'quotes', 'success');
  };

  const addInvoice = (payload: Partial<Invoice>) => {
    const total = Number(payload.total || 0);
    const amountPaid = Number(payload.amount_paid || (payload.status === 'paid' ? total : 0));
    const record: Invoice = {
      id: uid('invoice'),
      invoice_number: payload.invoice_number || `INV-${new Date().getFullYear()}-${String(invoices.length + 40).padStart(4, '0')}`,
      customer_id: payload.customer_id || customers[0]?.id || '',
      vehicle_id: payload.vehicle_id || vehicles[0]?.id || '',
      linked_work_order_id: payload.linked_work_order_id,
      subtotal: Number(payload.subtotal ?? total / 1.21),
      tax: Number(payload.tax ?? total - total / 1.21),
      discounts: Number(payload.discounts || 0),
      total,
      amount_paid: amountPaid,
      balance_due: Number(Math.max(total - amountPaid, 0).toFixed(2)),
      due_date: payload.due_date || nowIso(),
      status: (payload.status as Invoice['status']) || (amountPaid >= total ? 'paid' : 'sent'),
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    setInvoices((prev) => [record, ...prev]);
    appendAudit('invoice', record.id, 'created', { invoice_number: record.invoice_number });
    appendSystemLog(`Invoice ${record.invoice_number} created.`, 'invoices', 'success');
    return record;
  };

  const updateInvoice = (id: string, patch: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, ...patch, updated_at: nowIso() };
        const nextPaid = Number(next.amount_paid || 0);
        const nextBalance = Number(Math.max(Number(next.total) - nextPaid, 0).toFixed(2));
        return {
          ...next,
          amount_paid: nextPaid,
          balance_due: nextBalance,
          status: nextBalance === 0 ? 'paid' : nextPaid > 0 ? 'partial' : next.status,
        };
      })
    );
    appendAudit('invoice', id, 'updated', patch as Record<string, unknown>);
    appendSystemLog(`Invoice ${id} updated.`, 'invoices', 'success');
  };

  const addPayment = (payload: Partial<Payment>) => {
    const record: Payment = {
      id: uid('payment'),
      invoice_id: payload.invoice_id || invoices[0]?.id || '',
      amount: Number(payload.amount || 0),
      payment_method: (payload.payment_method as Payment['payment_method']) || 'card',
      payment_date: payload.payment_date || nowIso(),
      reference: payload.reference,
      status: (payload.status as Payment['status']) || 'completed',
      created_at: nowIso(),
    };
    setPayments((prev) => [record, ...prev]);
    setInvoices((prev) =>
      prev.map((item) => {
        if (item.id !== record.invoice_id) return item;
        const amountPaid = Number((item.amount_paid + record.amount).toFixed(2));
        const balanceDue = Number(Math.max(item.total - amountPaid, 0).toFixed(2));
        return {
          ...item,
          amount_paid: amountPaid,
          balance_due: balanceDue,
          status: balanceDue === 0 ? 'paid' : amountPaid > 0 ? 'partial' : item.status,
          updated_at: nowIso(),
        };
      })
    );
    appendAudit('payment', record.id, 'created', { amount: record.amount, invoice_id: record.invoice_id });
    appendSystemLog(`Payment of €${record.amount.toFixed(2)} recorded.`, 'payments', 'success');
    return record;
  };

  const updatePayment = (id: string, patch: Partial<Payment>) => {
    setPayments((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    appendAudit('payment', id, 'updated', patch as Record<string, unknown>);
    appendSystemLog(`Payment ${id} updated.`, 'payments', 'success');
  };

  const addCommunication = (payload: Partial<Communication>) => {
    const record: Communication = {
      id: uid('comm'),
      customer_id: payload.customer_id || customers[0]?.id || '',
      vehicle_id: payload.vehicle_id,
      work_order_id: payload.work_order_id,
      channel: (payload.channel as Communication['channel']) || 'phone',
      direction: (payload.direction as Communication['direction']) || 'outbound',
      subject: payload.subject,
      body: payload.body || '',
      timestamp: payload.timestamp || nowIso(),
      created_by: payload.created_by || 'u2',
    };
    setCommunications((prev) => [record, ...prev]);
    appendAudit('communication', record.id, 'created', { channel: record.channel });
    appendSystemLog(`Communication logged for customer ${record.customer_id}.`, 'communications', 'success');
    return record;
  };

  const updateCommunication = (id: string, patch: Partial<Communication>) => {
    setCommunications((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    appendAudit('communication', id, 'updated', patch as Record<string, unknown>);
    appendSystemLog(`Communication ${id} updated.`, 'communications', 'success');
  };

  const addDocument = (payload: Partial<DocumentRecord>) => {
    const record: DocumentRecord = {
      id: uid('doc'),
      entity_type: payload.entity_type || 'customer',
      entity_id: payload.entity_id || customers[0]?.id || '',
      file_name: payload.file_name || 'new-document.pdf',
      file_type: payload.file_type || 'pdf',
      category: payload.category || 'General',
      created_at: nowIso(),
      uploaded_by: payload.uploaded_by || 'u2',
    };
    setDocuments((prev) => [record, ...prev]);
    appendAudit('document', record.id, 'created', { file_name: record.file_name });
    appendSystemLog(`Document ${record.file_name} added.`, 'documents', 'success');
    return record;
  };

  const updateDocument = (id: string, patch: Partial<DocumentRecord>) => {
    setDocuments((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    appendAudit('document', id, 'updated', patch as Record<string, unknown>);
    appendSystemLog(`Document ${id} updated.`, 'documents', 'success');
  };

  const addTeamMember = (payload: Partial<TeamMember>) => {
    const record: TeamMember = {
      id: uid('user'),
      first_name: payload.first_name || 'New',
      last_name: payload.last_name || 'User',
      email: payload.email || '',
      phone: payload.phone,
      role: payload.role || 'read_only',
      active: payload.active ?? true,
      last_login: payload.last_login,
      created_at: nowIso(),
    };
    setTeamMembers((prev) => [record, ...prev]);
    appendAudit('team_member', record.id, 'created', { role: record.role });
    appendSystemLog(`Team member ${record.first_name} ${record.last_name} added.`, 'team', 'success');
    return record;
  };

  const updateTeamMember = (id: string, patch: Partial<TeamMember>) => {
    setTeamMembers((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    appendAudit('team_member', id, 'updated', patch as Record<string, unknown>);
    appendSystemLog(`Team member ${id} updated.`, 'team', 'success');
  };

  const toggleFeatureFlag = (name: string) => {
    setFeatureFlags((prev) => prev.map((item) => (item.name === name ? { ...item, enabled: !item.enabled } : item)));
    appendAudit('feature_flag', name, 'toggled', { name });
    appendSystemLog(`Feature flag “${name}” toggled.`, 'developer', 'success');
  };

  const saveApiKey = (id: string, value: string) => {
    setApiKeys((prev) => prev.map((item) => (item.id === id ? { ...item, value, configured: Boolean(value), updatedAt: nowIso() } : item)));
    appendAudit('api_key', id, 'updated', { configured: Boolean(value) });
    appendSystemLog(`API key ${id} saved.`, 'developer', 'success');
  };

  const updateIntegration = (name: string, patch: Partial<IntegrationRecord>) => {
    setIntegrations((prev) => prev.map((item) => (item.name === name ? { ...item, ...patch } : item)));
    appendAudit('integration', name, 'updated', patch as Record<string, unknown>);
    appendSystemLog(`Integration ${name} updated.`, 'integrations', 'success');
  };

  const testIntegration = (name: string) => {
    setIntegrations((prev) => prev.map((item) => (item.name === name ? { ...item, status: item.enabled ? 'connected' : 'disconnected', lastSync: nowIso() } : item)));
    appendAudit('integration', name, 'tested', { status: 'connected' });
    appendSystemLog(`Connection test completed for ${name}.`, 'integrations', 'success');
  };

  const syncIntegration = (name: string) => {
    setIntegrations((prev) => prev.map((item) => (item.name === name ? { ...item, lastSync: nowIso(), status: item.enabled ? 'connected' : item.status } : item)));
    appendAudit('integration', name, 'sync_run', { synced_at: nowIso() });
    appendSystemLog(`Manual sync started for ${name}.`, 'integrations', 'success');
  };

  const resetToSeed = (mode: 'seed' | 'reset') => {
    setCustomers(clone(demoCustomers));
    setVehicles(clone(demoVehicles));
    setAppointments(clone(demoAppointments));
    setWorkOrders(clone(demoWorkOrders));
    setQuotes(clone(demoQuotes));
    setInvoices(clone(demoInvoices));
    setPayments(clone(demoPayments));
    setParts(clone(demoParts));
    setSuppliers(clone(demoSuppliers));
    setInspections(clone(demoInspections));
    setCommunications(clone(demoCommunications));
    setTeamMembers(clone(demoTeamMembers));
    setDocuments(clone(documentSeed));
    setFeatureFlags(clone(featureFlagSeed));
    setApiKeys(clone(apiKeySeed));
    setIntegrations(clone(integrationSeed));
    setJobs(clone(jobSeed));
    setAiControls(clone(aiControlSeed));
    setSettingsSections(clone(settingsSeed));
    setDebugModeState(false);
    const auditSeed = clone(demoAuditLogs).reverse();
    const systemSeed = clone(systemLogSeed);
    const message = mode === 'seed' ? 'Demo data seeded again.' : 'Sandbox data reset to initial state.';
    setAuditLogs([
      {
        id: uid('audit'),
        user_id: 'u1',
        entity_type: 'system',
        entity_id: mode,
        action: mode === 'seed' ? 'seed_demo_data' : 'reset_sandbox',
        timestamp: nowIso(),
      },
      ...auditSeed,
    ]);
    setSystemLogs([
      { id: uid('log'), message, level: 'success', source: 'developer', timestamp: nowIso() },
      ...systemSeed,
    ]);
  };

  const seedDemoData = () => resetToSeed('seed');
  const resetDemoData = () => resetToSeed('reset');

  const importCsvData = (raw: string) => {
    const lines = raw.split('\n').filter((line) => line.trim().length > 0);
    appendAudit('import', 'csv', 'imported', { rows: lines.length });
    appendSystemLog(`CSV import processed ${lines.length} row(s).`, 'data-tools', 'success');
  };

  const downloadSnapshot = () => {
    const snapshot = {
      customers,
      vehicles,
      appointments,
      workOrders,
      quotes,
      invoices,
      payments,
      parts,
      suppliers,
      inspections,
      communications,
      documents,
      featureFlags,
      integrations,
      settingsSections,
      exportedAt: nowIso(),
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `workshopos-snapshot-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    appendAudit('snapshot', 'database', 'exported', { items: Object.keys(snapshot).length });
    appendSystemLog('Database snapshot exported.', 'data-tools', 'success');
  };

  const runJob = (id: string) => {
    setJobs((prev) => prev.map((job) => (job.id === id ? { ...job, status: 'completed', updatedAt: nowIso() } : job)));
    appendAudit('job', id, 'run_now');
    appendSystemLog(`Job ${id} executed.`, 'jobs', 'success');
  };

  const retryJob = (id: string) => {
    setJobs((prev) => prev.map((job) => (job.id === id ? { ...job, status: 'completed', retries: job.retries + 1, updatedAt: nowIso() } : job)));
    appendAudit('job', id, 'retried');
    appendSystemLog(`Job ${id} retried.`, 'jobs', 'success');
  };

  const toggleAiControl = (name: string) => {
    setAiControls((prev) => prev.map((item) => (item.name === name ? { ...item, enabled: !item.enabled } : item)));
    appendAudit('ai_control', name, 'toggled');
    appendSystemLog(`AI control “${name}” toggled.`, 'ai', 'success');
  };

  const setDebugMode = (enabled: boolean) => {
    setDebugModeState(enabled);
    appendAudit('security', 'debug_mode', enabled ? 'enabled' : 'disabled');
    appendSystemLog(`Debug mode ${enabled ? 'enabled' : 'disabled'}.`, 'security', 'success');
  };

  const saveSettingSection = (id: string, values: Record<string, string | boolean>) => {
    setSettingsSections((prev) => prev.map((section) => (section.id === id ? { ...section, values } : section)));
    appendAudit('settings_section', id, 'updated', values as Record<string, unknown>);
    appendSystemLog(`Settings section ${id} saved.`, 'settings', 'success');
  };

  const runMaintenanceAction = (action: string) => {
    appendAudit('maintenance', action, 'executed');
    appendSystemLog(`${action} completed successfully.`, 'maintenance', 'success');
  };

  return (
    <WorkshopContext.Provider
      value={{
        customers,
        vehicles,
        appointments,
        workOrders,
        quotes,
        invoices,
        payments,
        parts,
        suppliers,
        inspections,
        communications,
        teamMembers,
        documents,
        auditLogs,
        systemLogs,
        featureFlags,
        apiKeys,
        integrations,
        jobs,
        aiControls,
        settingsSections,
        notifications,
        debugMode,
        getCustomer,
        getVehicle,
        getTeamMember,
        getVehiclesForCustomer,
        getAppointmentsForCustomer,
        getWorkOrdersForCustomer,
        getInvoicesForCustomer,
        addCustomer,
        updateCustomer,
        addVehicle,
        updateVehicle,
        addAppointment,
        updateAppointment,
        addWorkOrder,
        updateWorkOrder,
        addInspection,
        updateInspection,
        addPart,
        updatePart,
        addSupplier,
        updateSupplier,
        addQuote,
        updateQuote,
        addInvoice,
        updateInvoice,
        addPayment,
        updatePayment,
        addCommunication,
        updateCommunication,
        addDocument,
        updateDocument,
        addTeamMember,
        updateTeamMember,
        toggleFeatureFlag,
        saveApiKey,
        updateIntegration,
        testIntegration,
        syncIntegration,
        seedDemoData,
        resetDemoData,
        importCsvData,
        downloadSnapshot,
        runJob,
        retryJob,
        toggleAiControl,
        setDebugMode,
        saveSettingSection,
        runMaintenanceAction,
      }}
    >
      {children}
    </WorkshopContext.Provider>
  );
}

export function useWorkshopStore() {
  const context = useContext(WorkshopContext);
  if (!context) {
    throw new Error('useWorkshopStore must be used within WorkshopProvider');
  }
  return context;
}
