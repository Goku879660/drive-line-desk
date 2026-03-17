import { Customer, Vehicle, Appointment, WorkOrder, Invoice, Payment, Part, Supplier, Quote, Communication, TeamMember, Inspection, AuditLog, LaborLine, PartLine } from '@/types';

const now = new Date();
const d = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString();
const future = (daysAhead: number) => new Date(now.getTime() + daysAhead * 86400000).toISOString();
const today = (h: number, m: number = 0) => {
  const t = new Date(now);
  t.setHours(h, m, 0, 0);
  return t.toISOString();
};

export const teamMembers: TeamMember[] = [
  { id: 'u1', first_name: 'Jan', last_name: 'de Vries', email: 'jan@workshopos.nl', phone: '06-12345678', role: 'owner', active: true, last_login: d(0), created_at: d(365) },
  { id: 'u2', first_name: 'Pieter', last_name: 'Bakker', email: 'pieter@workshopos.nl', phone: '06-23456789', role: 'service_advisor', active: true, last_login: d(0), created_at: d(300) },
  { id: 'u3', first_name: 'Marco', last_name: 'Jansen', email: 'marco@workshopos.nl', phone: '06-34567890', role: 'mechanic', active: true, last_login: d(0), created_at: d(280) },
  { id: 'u4', first_name: 'Erik', last_name: 'van Dijk', email: 'erik@workshopos.nl', role: 'mechanic', active: true, last_login: d(1), created_at: d(200) },
  { id: 'u5', first_name: 'Sophie', last_name: 'Mulder', email: 'sophie@workshopos.nl', role: 'front_desk', active: true, last_login: d(0), created_at: d(150) },
  { id: 'u6', first_name: 'Tom', last_name: 'Visser', email: 'tom@workshopos.nl', role: 'accountant', active: true, last_login: d(2), created_at: d(100) },
];

export const customers: Customer[] = [
  { id: 'c1', type: 'private', first_name: 'Henk', last_name: 'van den Berg', email: 'henk@email.nl', phone: '06-11111111', address: 'Kerkstraat 12', postal_code: '1011 AB', city: 'Amsterdam', country: 'NL', marketing_opt_in: true, created_at: d(200), updated_at: d(5) },
  { id: 'c2', type: 'business', company_name: 'De Boer Transport BV', first_name: 'Kees', last_name: 'de Boer', email: 'kees@deboertransport.nl', phone: '06-22222222', address: 'Industrieweg 45', postal_code: '3500 AA', city: 'Utrecht', country: 'NL', vat_number: 'NL123456789B01', kvk_number: '12345678', marketing_opt_in: true, created_at: d(180), updated_at: d(3) },
  { id: 'c3', type: 'private', first_name: 'Maria', last_name: 'Smit', email: 'maria.smit@email.nl', phone: '06-33333333', address: 'Dorpsstraat 8', postal_code: '2000 CD', city: 'Haarlem', country: 'NL', marketing_opt_in: false, created_at: d(150), updated_at: d(10) },
  { id: 'c4', type: 'business', company_name: 'Taxi Utrecht', first_name: 'Ahmed', last_name: 'El Amrani', email: 'ahmed@taxiutrecht.nl', phone: '06-44444444', address: 'Stationsplein 1', postal_code: '3500 BB', city: 'Utrecht', country: 'NL', vat_number: 'NL987654321B01', marketing_opt_in: true, created_at: d(120), updated_at: d(1) },
  { id: 'c5', type: 'private', first_name: 'Willem', last_name: 'Groot', email: 'willem.groot@email.nl', phone: '06-55555555', city: 'Rotterdam', country: 'NL', marketing_opt_in: true, created_at: d(100), updated_at: d(15) },
  { id: 'c6', type: 'private', first_name: 'Anna', last_name: 'Peters', email: 'anna.p@email.nl', phone: '06-66666666', city: 'Den Haag', country: 'NL', marketing_opt_in: false, created_at: d(90), updated_at: d(20) },
  { id: 'c7', type: 'business', company_name: 'Bloemen Express', first_name: 'Dirk', last_name: 'Blom', email: 'dirk@bloemenexpress.nl', phone: '06-77777777', city: 'Leiden', country: 'NL', vat_number: 'NL456789123B01', marketing_opt_in: true, created_at: d(80), updated_at: d(8) },
  { id: 'c8', type: 'private', first_name: 'Lisa', last_name: 'Vermeer', email: 'lisa.v@email.nl', phone: '06-88888888', city: 'Delft', country: 'NL', marketing_opt_in: true, created_at: d(70), updated_at: d(2) },
  { id: 'c9', type: 'private', first_name: 'Bram', last_name: 'Kuijpers', email: 'bram.k@email.nl', phone: '06-99999999', city: 'Eindhoven', country: 'NL', marketing_opt_in: false, created_at: d(60), updated_at: d(25) },
  { id: 'c10', type: 'business', company_name: 'SchoonMaak Pro', first_name: 'Sandra', last_name: 'Willems', email: 'sandra@schoonmaakpro.nl', phone: '06-10101010', city: 'Breda', country: 'NL', marketing_opt_in: true, created_at: d(50), updated_at: d(4) },
  { id: 'c11', type: 'private', first_name: 'Theo', last_name: 'Hendriks', email: 'theo.h@email.nl', phone: '06-12121212', city: 'Tilburg', country: 'NL', marketing_opt_in: true, created_at: d(45), updated_at: d(12) },
  { id: 'c12', type: 'private', first_name: 'Eva', last_name: 'de Jong', email: 'eva.dj@email.nl', phone: '06-13131313', city: 'Groningen', country: 'NL', marketing_opt_in: true, created_at: d(40), updated_at: d(7) },
];

export const vehicles: Vehicle[] = [
  { id: 'v1', customer_id: 'c1', license_plate: 'AB-123-CD', vin: 'WVWZZZ3CZWE123456', make: 'Volkswagen', model: 'Golf', year: 2019, fuel_type: 'petrol', transmission: 'manual', mileage: 67500, color: 'Silver', apk_expiry: future(45), last_service_date: d(120), created_at: d(200), updated_at: d(5) },
  { id: 'v2', customer_id: 'c1', license_plate: 'EF-456-GH', make: 'Toyota', model: 'Yaris', year: 2021, fuel_type: 'hybrid', transmission: 'automatic', mileage: 32000, color: 'White', apk_expiry: future(200), created_at: d(100), updated_at: d(30) },
  { id: 'v3', customer_id: 'c2', license_plate: 'IJ-789-KL', vin: 'WF0XXXGCDX1234567', make: 'Ford', model: 'Transit', year: 2018, fuel_type: 'diesel', transmission: 'manual', mileage: 145000, color: 'White', apk_expiry: d(-10), last_service_date: d(60), created_at: d(180), updated_at: d(3) },
  { id: 'v4', customer_id: 'c2', license_plate: 'MN-012-OP', make: 'Mercedes-Benz', model: 'Sprinter', year: 2020, fuel_type: 'diesel', transmission: 'manual', mileage: 98000, color: 'White', apk_expiry: future(90), created_at: d(150), updated_at: d(15) },
  { id: 'v5', customer_id: 'c3', license_plate: 'QR-345-ST', make: 'Peugeot', model: '208', year: 2022, fuel_type: 'electric', transmission: 'automatic', mileage: 18000, color: 'Blue', apk_expiry: future(300), created_at: d(140), updated_at: d(10) },
  { id: 'v6', customer_id: 'c4', license_plate: 'UV-678-WX', make: 'Tesla', model: 'Model 3', year: 2023, fuel_type: 'electric', transmission: 'automatic', mileage: 42000, color: 'Black', apk_expiry: future(500), created_at: d(110), updated_at: d(1) },
  { id: 'v7', customer_id: 'c4', license_plate: 'YZ-901-AB', make: 'Toyota', model: 'Corolla', year: 2020, fuel_type: 'hybrid', transmission: 'automatic', mileage: 89000, color: 'Grey', apk_expiry: future(30), created_at: d(100), updated_at: d(5) },
  { id: 'v8', customer_id: 'c5', license_plate: 'CD-234-EF', vin: 'WBAPH5C55BA123456', make: 'BMW', model: '3 Series', year: 2017, fuel_type: 'diesel', transmission: 'automatic', mileage: 132000, color: 'Black', apk_expiry: future(15), last_service_date: d(90), created_at: d(95), updated_at: d(15) },
  { id: 'v9', customer_id: 'c6', license_plate: 'GH-567-IJ', make: 'Renault', model: 'Clio', year: 2021, fuel_type: 'petrol', transmission: 'manual', mileage: 28000, color: 'Red', apk_expiry: future(250), created_at: d(85), updated_at: d(20) },
  { id: 'v10', customer_id: 'c7', license_plate: 'KL-890-MN', make: 'Citroën', model: 'Berlingo', year: 2019, fuel_type: 'diesel', transmission: 'manual', mileage: 112000, color: 'White', apk_expiry: future(60), created_at: d(75), updated_at: d(8) },
  { id: 'v11', customer_id: 'c8', license_plate: 'OP-123-QR', make: 'Audi', model: 'A3', year: 2020, fuel_type: 'petrol', transmission: 'automatic', mileage: 55000, color: 'Grey', apk_expiry: future(180), created_at: d(65), updated_at: d(2) },
  { id: 'v12', customer_id: 'c9', license_plate: 'ST-456-UV', make: 'Opel', model: 'Corsa', year: 2018, fuel_type: 'petrol', transmission: 'manual', mileage: 78000, color: 'Green', apk_expiry: future(5), created_at: d(55), updated_at: d(25) },
  { id: 'v13', customer_id: 'c10', license_plate: 'WX-789-YZ', make: 'Fiat', model: 'Ducato', year: 2017, fuel_type: 'diesel', transmission: 'manual', mileage: 195000, color: 'White', apk_expiry: d(-30), created_at: d(45), updated_at: d(4) },
  { id: 'v14', customer_id: 'c11', license_plate: 'AB-012-CD', make: 'Volkswagen', model: 'Polo', year: 2022, fuel_type: 'petrol', transmission: 'manual', mileage: 22000, color: 'Red', apk_expiry: future(400), created_at: d(40), updated_at: d(12) },
  { id: 'v15', customer_id: 'c12', license_plate: 'EF-345-GH', make: 'Skoda', model: 'Octavia', year: 2021, fuel_type: 'diesel', transmission: 'automatic', mileage: 65000, color: 'Blue', apk_expiry: future(150), created_at: d(35), updated_at: d(7) },
];

export const appointments: Appointment[] = [
  { id: 'a1', customer_id: 'c1', vehicle_id: 'v1', scheduled_start: today(8, 0), scheduled_end: today(10, 0), appointment_type: 'Service', complaint_description: 'Annual service + brake check', status: 'confirmed', created_at: d(7), updated_at: d(1) },
  { id: 'a2', customer_id: 'c3', vehicle_id: 'v5', scheduled_start: today(9, 0), scheduled_end: today(10, 30), appointment_type: 'Repair', complaint_description: 'Charging port issue', status: 'arrived', created_at: d(5), updated_at: d(0) },
  { id: 'a3', customer_id: 'c4', vehicle_id: 'v6', scheduled_start: today(10, 0), scheduled_end: today(11, 30), appointment_type: 'Inspection', complaint_description: 'Pre-purchase inspection', status: 'planned', created_at: d(3), updated_at: d(1) },
  { id: 'a4', customer_id: 'c5', vehicle_id: 'v8', scheduled_start: today(11, 0), scheduled_end: today(13, 0), appointment_type: 'APK', complaint_description: 'APK keuring + small service', status: 'confirmed', created_at: d(10), updated_at: d(2) },
  { id: 'a5', customer_id: 'c8', vehicle_id: 'v11', scheduled_start: today(13, 30), scheduled_end: today(15, 0), appointment_type: 'Repair', complaint_description: 'Strange noise from front suspension', status: 'planned', created_at: d(4), updated_at: d(1) },
  { id: 'a6', customer_id: 'c2', vehicle_id: 'v3', scheduled_start: today(14, 0), scheduled_end: today(16, 0), appointment_type: 'Service', complaint_description: 'Oil change + filter replacement', status: 'planned', created_at: d(6), updated_at: d(2) },
  { id: 'a7', customer_id: 'c9', vehicle_id: 'v12', scheduled_start: future(1).replace(/T.*/, 'T08:00:00.000Z'), scheduled_end: future(1).replace(/T.*/, 'T10:00:00.000Z'), appointment_type: 'APK', complaint_description: 'APK expiring soon', status: 'confirmed', created_at: d(8), updated_at: d(3) },
  { id: 'a8', customer_id: 'c7', vehicle_id: 'v10', scheduled_start: future(1).replace(/T.*/, 'T10:00:00.000Z'), scheduled_end: future(1).replace(/T.*/, 'T12:00:00.000Z'), appointment_type: 'Repair', complaint_description: 'Clutch slipping', status: 'planned', created_at: d(2), updated_at: d(0) },
];

export const workOrders: WorkOrder[] = [
  { id: 'wo1', work_order_number: 'WO-2024-0032', customer_id: 'c1', vehicle_id: 'v1', appointment_id: 'a1', intake_notes: 'Customer reports squeaky brakes', diagnosis_notes: 'Front brake pads worn below minimum. Discs still OK.', status: 'in_progress', priority: 'normal', assigned_technician_id: 'u3', promised_date: today(17, 0), created_at: d(0), updated_at: d(0) },
  { id: 'wo2', work_order_number: 'WO-2024-0031', customer_id: 'c2', vehicle_id: 'v3', intake_notes: 'Fleet vehicle - 150k service', status: 'awaiting_approval', priority: 'high', assigned_technician_id: 'u4', promised_date: future(2), created_at: d(2), updated_at: d(1) },
  { id: 'wo3', work_order_number: 'WO-2024-0030', customer_id: 'c4', vehicle_id: 'v7', intake_notes: 'Brake fluid change + tire rotation', status: 'completed', priority: 'normal', assigned_technician_id: 'u3', actual_completion_date: d(1), created_at: d(5), updated_at: d(1) },
  { id: 'wo4', work_order_number: 'WO-2024-0029', customer_id: 'c5', vehicle_id: 'v8', intake_notes: 'APK + timing belt replacement', status: 'parts_ordered', priority: 'high', assigned_technician_id: 'u4', promised_date: future(3), created_at: d(4), updated_at: d(1) },
  { id: 'wo5', work_order_number: 'WO-2024-0028', customer_id: 'c6', vehicle_id: 'v9', intake_notes: 'Oil leak investigation', diagnosis_notes: 'Valve cover gasket leaking', status: 'approved', priority: 'normal', assigned_technician_id: 'u3', created_at: d(6), updated_at: d(2) },
  { id: 'wo6', work_order_number: 'WO-2024-0027', customer_id: 'c8', vehicle_id: 'v11', status: 'invoiced', priority: 'low', assigned_technician_id: 'u4', actual_completion_date: d(3), invoice_id: 'inv1', created_at: d(10), updated_at: d(3) },
  { id: 'wo7', work_order_number: 'WO-2024-0026', customer_id: 'c10', vehicle_id: 'v13', intake_notes: 'Engine warning light on', status: 'diagnosis', priority: 'urgent', assigned_technician_id: 'u3', created_at: d(1), updated_at: d(0) },
  { id: 'wo8', work_order_number: 'WO-2024-0025', customer_id: 'c11', vehicle_id: 'v14', status: 'closed', priority: 'normal', actual_completion_date: d(8), invoice_id: 'inv3', created_at: d(15), updated_at: d(8) },
  { id: 'wo9', work_order_number: 'WO-2024-0024', customer_id: 'c3', vehicle_id: 'v5', status: 'draft', priority: 'low', created_at: d(0), updated_at: d(0) },
  { id: 'wo10', work_order_number: 'WO-2024-0023', customer_id: 'c12', vehicle_id: 'v15', intake_notes: 'AC not cooling properly', status: 'waiting_external', priority: 'normal', assigned_technician_id: 'u4', promised_date: future(5), created_at: d(3), updated_at: d(1) },
];

export const laborLines: LaborLine[] = [
  { id: 'll1', work_order_id: 'wo1', description: 'Front brake pad replacement', hours: 1.5, rate: 85, total: 127.5 },
  { id: 'll2', work_order_id: 'wo1', description: 'Brake fluid flush', hours: 0.5, rate: 85, total: 42.5 },
  { id: 'll3', work_order_id: 'wo2', description: '150,000km major service', hours: 4.0, rate: 85, total: 340 },
  { id: 'll4', work_order_id: 'wo3', description: 'Brake fluid change', hours: 0.5, rate: 85, total: 42.5 },
  { id: 'll5', work_order_id: 'wo3', description: 'Tire rotation', hours: 0.5, rate: 85, total: 42.5 },
  { id: 'll6', work_order_id: 'wo4', description: 'Timing belt replacement', hours: 3.0, rate: 85, total: 255 },
  { id: 'll7', work_order_id: 'wo4', description: 'APK inspection', hours: 0.75, rate: 85, total: 63.75 },
];

export const partLines: PartLine[] = [
  { id: 'pl1', work_order_id: 'wo1', part_id: 'p1', description: 'Front brake pads (set)', quantity: 1, unit_price: 65, total: 65 },
  { id: 'pl2', work_order_id: 'wo1', part_id: 'p3', description: 'Brake fluid DOT4 1L', quantity: 1, unit_price: 18, total: 18 },
  { id: 'pl3', work_order_id: 'wo2', description: 'Oil filter', quantity: 1, unit_price: 12, total: 12 },
  { id: 'pl4', work_order_id: 'wo2', description: 'Engine oil 5W30 5L', quantity: 1, unit_price: 45, total: 45 },
  { id: 'pl5', work_order_id: 'wo4', description: 'Timing belt kit', quantity: 1, unit_price: 185, total: 185 },
  { id: 'pl6', work_order_id: 'wo4', description: 'Water pump', quantity: 1, unit_price: 95, total: 95 },
];

export const invoices: Invoice[] = [
  { id: 'inv1', invoice_number: 'INV-2024-0045', customer_id: 'c8', vehicle_id: 'v11', linked_work_order_id: 'wo6', subtotal: 420, tax: 88.20, discounts: 0, total: 508.20, amount_paid: 508.20, balance_due: 0, due_date: d(-5), status: 'paid', created_at: d(3), updated_at: d(1) },
  { id: 'inv2', invoice_number: 'INV-2024-0044', customer_id: 'c2', vehicle_id: 'v4', subtotal: 890, tax: 186.90, discounts: 50, total: 1026.90, amount_paid: 0, balance_due: 1026.90, due_date: d(-3), status: 'overdue', created_at: d(18), updated_at: d(0) },
  { id: 'inv3', invoice_number: 'INV-2024-0043', customer_id: 'c11', vehicle_id: 'v14', linked_work_order_id: 'wo8', subtotal: 245, tax: 51.45, discounts: 0, total: 296.45, amount_paid: 296.45, balance_due: 0, due_date: d(10), status: 'paid', created_at: d(8), updated_at: d(5) },
  { id: 'inv4', invoice_number: 'INV-2024-0042', customer_id: 'c4', vehicle_id: 'v6', subtotal: 180, tax: 37.80, discounts: 0, total: 217.80, amount_paid: 100, balance_due: 117.80, due_date: future(10), status: 'partial', created_at: d(5), updated_at: d(2) },
  { id: 'inv5', invoice_number: 'INV-2024-0041', customer_id: 'c7', vehicle_id: 'v10', subtotal: 1250, tax: 262.50, discounts: 75, total: 1437.50, amount_paid: 0, balance_due: 1437.50, due_date: future(15), status: 'sent', created_at: d(2), updated_at: d(1) },
  { id: 'inv6', invoice_number: 'INV-2024-0040', customer_id: 'c3', vehicle_id: 'v5', subtotal: 320, tax: 67.20, discounts: 0, total: 387.20, amount_paid: 387.20, balance_due: 0, due_date: d(20), status: 'paid', created_at: d(25), updated_at: d(20) },
];

export const payments: Payment[] = [
  { id: 'pay1', invoice_id: 'inv1', amount: 508.20, payment_method: 'card', payment_date: d(1), reference: 'PIN-4521', status: 'completed', created_at: d(1) },
  { id: 'pay2', invoice_id: 'inv3', amount: 296.45, payment_method: 'bank_transfer', payment_date: d(5), reference: 'NL91ABNA0417164300', status: 'completed', created_at: d(5) },
  { id: 'pay3', invoice_id: 'inv4', amount: 100, payment_method: 'cash', payment_date: d(2), status: 'completed', created_at: d(2) },
  { id: 'pay4', invoice_id: 'inv6', amount: 387.20, payment_method: 'bank_transfer', payment_date: d(20), reference: 'NL91ABNA0417164300', status: 'completed', created_at: d(20) },
];

export const quotes: Quote[] = [
  { id: 'q1', quote_number: 'QT-2024-0018', customer_id: 'c2', vehicle_id: 'v3', linked_work_order_id: 'wo2', subtotal: 740, tax: 155.40, total: 895.40, validity_date: future(14), status: 'sent', created_at: d(2), updated_at: d(1) },
  { id: 'q2', quote_number: 'QT-2024-0017', customer_id: 'c5', vehicle_id: 'v8', linked_work_order_id: 'wo4', subtotal: 598.75, tax: 125.74, total: 724.49, validity_date: future(7), status: 'approved', created_at: d(5), updated_at: d(3) },
  { id: 'q3', quote_number: 'QT-2024-0016', customer_id: 'c9', vehicle_id: 'v12', subtotal: 350, tax: 73.50, total: 423.50, validity_date: d(-2), status: 'expired', created_at: d(20), updated_at: d(2) },
  { id: 'q4', quote_number: 'QT-2024-0015', customer_id: 'c6', vehicle_id: 'v9', linked_work_order_id: 'wo5', subtotal: 280, tax: 58.80, total: 338.80, validity_date: future(10), status: 'approved', created_at: d(6), updated_at: d(4) },
];

export const parts: Part[] = [
  { id: 'p1', sku: 'BP-VW-001', brand: 'Bosch', description: 'Front brake pads - VW Golf VII', category: 'Brakes', supplier_id: 's1', purchase_price: 32, sale_price: 65, stock_quantity: 8, min_stock_level: 3, location: 'A1-03', created_at: d(200), updated_at: d(5) },
  { id: 'p2', sku: 'BP-VW-002', brand: 'Bosch', description: 'Rear brake pads - VW Golf VII', category: 'Brakes', supplier_id: 's1', purchase_price: 28, sale_price: 55, stock_quantity: 5, min_stock_level: 3, location: 'A1-04', created_at: d(200), updated_at: d(10) },
  { id: 'p3', sku: 'BF-DOT4-1L', brand: 'Castrol', description: 'Brake fluid DOT4 1L', category: 'Fluids', supplier_id: 's2', purchase_price: 8, sale_price: 18, stock_quantity: 15, min_stock_level: 5, location: 'B2-01', created_at: d(150), updated_at: d(3) },
  { id: 'p4', sku: 'OF-GEN-001', brand: 'Mann', description: 'Oil filter - Generic fit', category: 'Filters', supplier_id: 's1', purchase_price: 5, sale_price: 12, stock_quantity: 22, min_stock_level: 10, location: 'B1-01', created_at: d(150), updated_at: d(7) },
  { id: 'p5', sku: 'EO-5W30-5L', brand: 'Shell', description: 'Engine oil Helix Ultra 5W-30 5L', category: 'Fluids', supplier_id: 's2', purchase_price: 28, sale_price: 52, stock_quantity: 12, min_stock_level: 5, location: 'B2-02', created_at: d(100), updated_at: d(2) },
  { id: 'p6', sku: 'TB-BMW-001', brand: 'Gates', description: 'Timing belt kit - BMW N47', category: 'Engine', supplier_id: 's3', purchase_price: 95, sale_price: 185, stock_quantity: 2, min_stock_level: 1, location: 'C1-01', created_at: d(80), updated_at: d(4) },
  { id: 'p7', sku: 'WP-BMW-001', brand: 'SKF', description: 'Water pump - BMW N47', category: 'Engine', supplier_id: 's3', purchase_price: 48, sale_price: 95, stock_quantity: 1, min_stock_level: 1, location: 'C1-02', created_at: d(80), updated_at: d(4) },
  { id: 'p8', sku: 'AF-GEN-001', brand: 'Mann', description: 'Air filter - Universal', category: 'Filters', supplier_id: 's1', purchase_price: 8, sale_price: 22, stock_quantity: 18, min_stock_level: 8, location: 'B1-02', created_at: d(120), updated_at: d(15) },
  { id: 'p9', sku: 'SP-NGK-001', brand: 'NGK', description: 'Spark plug - Iridium IX', category: 'Ignition', supplier_id: 's1', purchase_price: 6, sale_price: 14, stock_quantity: 30, min_stock_level: 12, location: 'D1-01', created_at: d(100), updated_at: d(8) },
  { id: 'p10', sku: 'CL-GEN-001', brand: 'Prestone', description: 'Coolant concentrate 1L', category: 'Fluids', supplier_id: 's2', purchase_price: 7, sale_price: 16, stock_quantity: 10, min_stock_level: 4, location: 'B2-03', created_at: d(90), updated_at: d(12) },
  { id: 'p11', sku: 'WB-GEN-001', brand: 'Bosch', description: 'Wiper blades 600/475mm', category: 'Body', supplier_id: 's1', purchase_price: 12, sale_price: 28, stock_quantity: 6, min_stock_level: 3, location: 'E1-01', created_at: d(70), updated_at: d(20) },
  { id: 'p12', sku: 'BAT-12V-70', brand: 'Varta', description: 'Battery 12V 70Ah', category: 'Electrical', supplier_id: 's4', purchase_price: 65, sale_price: 135, stock_quantity: 3, min_stock_level: 2, location: 'F1-01', created_at: d(60), updated_at: d(5) },
  { id: 'p13', sku: 'DR-VW-001', brand: 'Brembo', description: 'Front brake disc - VW Golf VII', category: 'Brakes', supplier_id: 's1', purchase_price: 45, sale_price: 89, stock_quantity: 4, min_stock_level: 2, location: 'A1-05', created_at: d(50), updated_at: d(8) },
  { id: 'p14', sku: 'CV-REN-001', brand: 'SKF', description: 'CV joint boot kit - Renault', category: 'Drivetrain', supplier_id: 's3', purchase_price: 18, sale_price: 42, stock_quantity: 2, min_stock_level: 1, location: 'C2-01', created_at: d(40), updated_at: d(15) },
  { id: 'p15', sku: 'TH-GEN-001', brand: 'Gates', description: 'Thermostat housing - Generic', category: 'Cooling', supplier_id: 's3', purchase_price: 22, sale_price: 48, stock_quantity: 0, min_stock_level: 1, location: 'C3-01', created_at: d(30), updated_at: d(2) },
];

export const suppliers: Supplier[] = [
  { id: 's1', name: 'AutoParts Direct', contact_name: 'Frank van Houten', email: 'orders@autopartsdirect.nl', phone: '020-1234567', ordering_method: 'API', delivery_terms: 'Next day before 12:00', connection_status: 'connected', created_at: d(300), updated_at: d(5) },
  { id: 's2', name: 'FluidTech Supplies', contact_name: 'Anja Meijer', email: 'info@fluidtech.nl', phone: '030-2345678', ordering_method: 'Email', delivery_terms: '2-3 business days', connection_status: 'connected', created_at: d(250), updated_at: d(10) },
  { id: 's3', name: 'ProDrive Components', contact_name: 'Ruben Dekker', email: 'sales@prodrive.nl', phone: '040-3456789', ordering_method: 'Portal', delivery_terms: 'Same day if ordered before 10:00', connection_status: 'connected', created_at: d(200), updated_at: d(3) },
  { id: 's4', name: 'PowerVolt Batteries', contact_name: 'Karel Vos', email: 'orders@powervolt.nl', phone: '010-4567890', ordering_method: 'Phone', delivery_terms: '1-2 business days', connection_status: 'disconnected', notes: 'Backup supplier for batteries', created_at: d(150), updated_at: d(30) },
  { id: 's5', name: 'TireWorld NL', contact_name: 'Linda Bos', email: 'b2b@tireworld.nl', phone: '050-5678901', ordering_method: 'API', delivery_terms: 'Next business day', connection_status: 'connected', created_at: d(100), updated_at: d(8) },
];

export const communications: Communication[] = [
  { id: 'com1', customer_id: 'c1', vehicle_id: 'v1', work_order_id: 'wo1', channel: 'phone', direction: 'inbound', subject: 'Appointment confirmation', body: 'Customer called to confirm appointment for tomorrow. Mentioned brakes are squeaking louder now.', timestamp: d(1), created_by: 'u5' },
  { id: 'com2', customer_id: 'c2', vehicle_id: 'v3', work_order_id: 'wo2', channel: 'email', direction: 'outbound', subject: 'Quote for 150k service', body: 'Sent quote QT-2024-0018 for the major service on the Transit. Awaiting approval.', timestamp: d(2), created_by: 'u2' },
  { id: 'com3', customer_id: 'c5', vehicle_id: 'v8', channel: 'whatsapp', direction: 'outbound', subject: 'Parts update', body: 'Hi Willem, the timing belt kit has been ordered and should arrive tomorrow. We expect to finish by Friday.', timestamp: d(1), created_by: 'u2' },
  { id: 'com4', customer_id: 'c4', channel: 'phone', direction: 'inbound', subject: 'Invoice question', body: 'Ahmed called about invoice INV-2024-0042. Wants to pay remaining balance next week.', timestamp: d(0), created_by: 'u5' },
  { id: 'com5', customer_id: 'c8', vehicle_id: 'v11', channel: 'sms', direction: 'outbound', subject: 'Vehicle ready', body: 'Your Audi A3 is ready for pickup. Invoice has been paid. Thank you!', timestamp: d(3), created_by: 'u5' },
  { id: 'com6', customer_id: 'c10', vehicle_id: 'v13', work_order_id: 'wo7', channel: 'phone', direction: 'inbound', subject: 'Engine warning light', body: 'Sandra called urgently. Ducato showing engine warning light, need immediate diagnosis.', timestamp: d(1), created_by: 'u5' },
];

export const inspections: Inspection[] = [
  { id: 'insp1', vehicle_id: 'v8', work_order_id: 'wo4', result: 'advisory', advisories: ['Front tires worn to 3mm', 'Minor oil seepage around valve cover'], defects: [], signed_by: 'u3', signed_at: d(3), created_at: d(3), updated_at: d(3) },
  { id: 'insp2', vehicle_id: 'v7', work_order_id: 'wo3', result: 'pass', advisories: ['Rear brake pads approaching minimum'], defects: [], signed_by: 'u3', signed_at: d(2), created_at: d(5), updated_at: d(2) },
  { id: 'insp3', vehicle_id: 'v13', result: 'fail', advisories: ['Exhaust emissions high'], defects: ['Front left ball joint excessive play', 'Rear brake discs below minimum thickness'], signed_by: 'u4', signed_at: d(4), created_at: d(4), updated_at: d(4) },
];

export const auditLogs: AuditLog[] = [
  { id: 'al1', user_id: 'u2', entity_type: 'work_order', entity_id: 'wo1', action: 'status_change', new_values: { status: 'in_progress' }, timestamp: d(0) },
  { id: 'al2', user_id: 'u5', entity_type: 'appointment', entity_id: 'a2', action: 'status_change', new_values: { status: 'arrived' }, timestamp: d(0) },
  { id: 'al3', user_id: 'u3', entity_type: 'work_order', entity_id: 'wo3', action: 'status_change', new_values: { status: 'completed' }, timestamp: d(1) },
  { id: 'al4', user_id: 'u6', entity_type: 'invoice', entity_id: 'inv1', action: 'payment_recorded', new_values: { amount: 508.20 }, timestamp: d(1) },
  { id: 'al5', user_id: 'u2', entity_type: 'quote', entity_id: 'q1', action: 'created', timestamp: d(2) },
];

// Helper to resolve references
export function getCustomer(id: string) { return customers.find(c => c.id === id); }
export function getVehicle(id: string) { return vehicles.find(v => v.id === id); }
export function getVehiclesForCustomer(customerId: string) { return vehicles.filter(v => v.customer_id === customerId); }
export function getAppointmentsForCustomer(customerId: string) { return appointments.filter(a => a.customer_id === customerId); }
export function getWorkOrdersForCustomer(customerId: string) { return workOrders.filter(w => w.customer_id === customerId); }
export function getInvoicesForCustomer(customerId: string) { return invoices.filter(i => i.customer_id === customerId); }
export function getTeamMember(id: string) { return teamMembers.find(t => t.id === id); }
export function getLaborLinesForWO(woId: string) { return laborLines.filter(l => l.work_order_id === woId); }
export function getPartLinesForWO(woId: string) { return partLines.filter(p => p.work_order_id === woId); }
