// WorkshopOS Domain Types

export type CustomerType = 'private' | 'business';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'lpg' | 'cng';
export type TransmissionType = 'manual' | 'automatic' | 'cvt';

export type AppointmentStatus = 'planned' | 'confirmed' | 'arrived' | 'in_progress' | 'completed' | 'no_show' | 'cancelled';
export type WorkOrderStatus = 'draft' | 'open' | 'diagnosis' | 'awaiting_approval' | 'approved' | 'parts_ordered' | 'in_progress' | 'waiting_external' | 'completed' | 'invoiced' | 'closed';
export type WorkOrderPriority = 'low' | 'normal' | 'high' | 'urgent';
export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'declined' | 'expired' | 'converted';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled' | 'credited';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'online';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type InspectionResult = 'pass' | 'advisory' | 'fail';
export type CommunicationChannel = 'phone' | 'email' | 'sms' | 'whatsapp' | 'internal';
export type CommunicationDirection = 'inbound' | 'outbound';

export interface Customer {
  id: string;
  type: CustomerType;
  company_name?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  secondary_phone?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  vat_number?: string;
  kvk_number?: string;
  notes?: string;
  marketing_opt_in: boolean;
  preferred_contact_method?: string;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  customer_id: string;
  license_plate: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  fuel_type: FuelType;
  transmission: TransmissionType;
  mileage: number;
  color?: string;
  apk_expiry?: string;
  last_service_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  customer_id: string;
  vehicle_id: string;
  scheduled_start: string;
  scheduled_end: string;
  appointment_type: string;
  complaint_description?: string;
  internal_notes?: string;
  assigned_mechanic_id?: string;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
}

export interface WorkOrder {
  id: string;
  work_order_number: string;
  customer_id: string;
  vehicle_id: string;
  appointment_id?: string;
  intake_notes?: string;
  diagnosis_notes?: string;
  technician_notes?: string;
  internal_notes?: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  assigned_technician_id?: string;
  promised_date?: string;
  actual_completion_date?: string;
  invoice_id?: string;
  created_at: string;
  updated_at: string;
}

export interface LaborLine {
  id: string;
  work_order_id: string;
  description: string;
  hours: number;
  rate: number;
  total: number;
}

export interface PartLine {
  id: string;
  work_order_id: string;
  part_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Quote {
  id: string;
  quote_number: string;
  customer_id: string;
  vehicle_id: string;
  linked_work_order_id?: string;
  subtotal: number;
  tax: number;
  total: number;
  validity_date: string;
  status: QuoteStatus;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  vehicle_id: string;
  linked_work_order_id?: string;
  subtotal: number;
  tax: number;
  discounts: number;
  total: number;
  amount_paid: number;
  balance_due: number;
  due_date: string;
  status: InvoiceStatus;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_date: string;
  reference?: string;
  status: PaymentStatus;
  created_at: string;
}

export interface Part {
  id: string;
  sku: string;
  brand: string;
  description: string;
  category: string;
  supplier_id?: string;
  purchase_price: number;
  sale_price: number;
  stock_quantity: number;
  min_stock_level: number;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  ordering_method?: string;
  delivery_terms?: string;
  connection_status: 'connected' | 'disconnected' | 'error';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Inspection {
  id: string;
  vehicle_id: string;
  work_order_id?: string;
  result: InspectionResult;
  advisories: string[];
  defects: string[];
  signed_by?: string;
  signed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Communication {
  id: string;
  customer_id: string;
  vehicle_id?: string;
  work_order_id?: string;
  channel: CommunicationChannel;
  direction: CommunicationDirection;
  subject?: string;
  body: string;
  timestamp: string;
  created_by?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  timestamp: string;
}

export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  active: boolean;
  last_login?: string;
  created_at: string;
}
