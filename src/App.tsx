import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import CustomersPage from "./pages/Customers";
import VehiclesPage from "./pages/Vehicles";
import CalendarPage from "./pages/Calendar";
import AppointmentsPage from "./pages/Appointments";
import WorkOrdersPage from "./pages/WorkOrders";
import InspectionsPage from "./pages/Inspections";
import PartsPage from "./pages/Parts";
import SuppliersPage from "./pages/Suppliers";
import QuotesPage from "./pages/Quotes";
import InvoicesPage from "./pages/Invoices";
import PaymentsPage from "./pages/Payments";
import CommunicationsPage from "./pages/Communications";
import DocumentsPage from "./pages/Documents";
import ReportsPage from "./pages/Reports";
import TeamPage from "./pages/Team";
import SettingsPage from "./pages/Settings";
import DeveloperPage from "./pages/Developer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="*" element={
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/work-orders" element={<WorkOrdersPage />} />
                <Route path="/inspections" element={<InspectionsPage />} />
                <Route path="/parts" element={<PartsPage />} />
                <Route path="/suppliers" element={<SuppliersPage />} />
                <Route path="/quotes" element={<QuotesPage />} />
                <Route path="/invoices" element={<InvoicesPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/communications" element={<CommunicationsPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/developer" element={<DeveloperPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
