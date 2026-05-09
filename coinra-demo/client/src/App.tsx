import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ReceiptCapture from "./pages/ap/ReceiptCapture";
import APInvoices from "./pages/ap/APInvoices";
import Payments from "./pages/ap/Payments";
import AROverview from "./pages/ar/AROverview";
import ARInvoices from "./pages/ar/ARInvoices";
import Collections from "./pages/ar/Collections";
import TalkToYourBooks from "./pages/TalkToYourBooks";
import Reports from "./pages/Reports";
import Permissions from "./pages/settings/Permissions";
import SettingsPage from "./pages/settings/Settings";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/ap/receipts" component={ReceiptCapture} />
        <Route path="/ap/invoices" component={APInvoices} />
        <Route path="/ap/payments" component={Payments} />
        <Route path="/ar" component={AROverview} />
        <Route path="/ar/overview" component={AROverview} />
        <Route path="/ar/invoices" component={ARInvoices} />
        <Route path="/ar/collections" component={Collections} />
        <Route path="/chat" component={TalkToYourBooks} />
        <Route path="/reports" component={Reports} />
        <Route path="/settings/permissions" component={Permissions} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </ErrorBoundary>
  );
}
