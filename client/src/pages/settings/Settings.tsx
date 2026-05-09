import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Link2, CheckCircle2, AlertCircle, Settings2, Zap, RefreshCw, ExternalLink } from "lucide-react";

const erpIntegrations = [
  {
    id: "quickbooks",
    name: "QuickBooks Online",
    description: "Two-way sync for invoices, expenses, and chart of accounts",
    logo: "QB",
    logoColor: "bg-green-500",
    status: "connected",
    lastSync: "2 minutes ago",
    features: ["Invoice sync", "Expense sync", "Chart of accounts", "Vendor sync"],
  },
  {
    id: "xero",
    name: "Xero",
    description: "Real-time sync for AP/AR invoices, bank feeds, and contacts",
    logo: "X",
    logoColor: "bg-blue-500",
    status: "disconnected",
    lastSync: null,
    features: ["Invoice sync", "Bank feed", "Contact sync", "Tax codes"],
  },
  {
    id: "sage",
    name: "Sage Business Cloud",
    description: "Sync invoices, payments, and ledger entries with Sage",
    logo: "S",
    logoColor: "bg-emerald-600",
    status: "disconnected",
    lastSync: null,
    features: ["Invoice sync", "Payment sync", "Ledger entries", "Cost centres"],
  },
  {
    id: "sap",
    name: "SAP S/4HANA",
    description: "Enterprise-grade integration with SAP financial modules",
    logo: "SAP",
    logoColor: "bg-blue-700",
    status: "disconnected",
    lastSync: null,
    features: ["FI module sync", "CO module", "Vendor master", "Payment runs"],
  },
  {
    id: "netsuite",
    name: "NetSuite",
    description: "Full ERP sync including subsidiaries and multi-currency",
    logo: "NS",
    logoColor: "bg-orange-500",
    status: "disconnected",
    lastSync: null,
    features: ["Multi-entity", "Multi-currency", "Subsidiary sync", "Custom fields"],
  },
];

const googleIntegrations = [
  {
    id: "google_drive",
    name: "Google Drive",
    description: "Store receipt photos in year-month organized folders",
    logo: "GD",
    logoColor: "bg-yellow-500",
    status: "connected",
    lastSync: "Just now",
    detail: "Folder: Coinra Receipts / 2026-04",
  },
  {
    id: "google_sheets",
    name: "Google Sheets",
    description: "Auto-append expense rows (date, vendor, total, category, photo link)",
    logo: "GS",
    logoColor: "bg-green-600",
    status: "connected",
    lastSync: "Just now",
    detail: "Sheet: Coinra Expenses 2026",
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("integrations");

  const handleConnect = (name: string) => {
    toast.info(`Connecting to ${name}...`, { description: "OAuth flow would open here in production" });
  };

  const handleSync = (name: string) => {
    toast.success(`Syncing with ${name}`, { description: "Full sync initiated" });
  };

  return (
    <div className="p-6 max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure integrations, accounting policies, and platform preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/30">
          <TabsTrigger value="integrations">ERP Integrations</TabsTrigger>
          <TabsTrigger value="google">Google Workspace</TabsTrigger>
          <TabsTrigger value="accounting">Accounting Policies</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* ERP Integrations */}
        <TabsContent value="integrations" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {erpIntegrations.map((erp) => (
              <Card key={erp.id} className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-xl ${erp.logoColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                      {erp.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold">{erp.name}</h3>
                        {erp.status === "connected" ? (
                          <Badge className="badge-green text-[10px]">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
                          </Badge>
                        ) : (
                          <Badge className="badge-gray text-[10px]">Not Connected</Badge>
                        )}
                        {erp.lastSync && (
                          <span className="text-xs text-muted-foreground">Last sync: {erp.lastSync}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{erp.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {erp.features.map((f) => (
                          <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground">{f}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {erp.status === "connected" ? (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleSync(erp.name)}>
                            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Sync Now
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => toast.info("Disconnect feature coming soon")} className="text-destructive">
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" onClick={() => handleConnect(erp.name)}>
                          <Link2 className="h-3.5 w-3.5 mr-1.5" /> Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Google Workspace */}
        <TabsContent value="google" className="mt-6 space-y-4">
          {googleIntegrations.map((g) => (
            <Card key={g.id} className="bg-card border-border">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl ${g.logoColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {g.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{g.name}</h3>
                      <Badge className="badge-green text-[10px]">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{g.description}</p>
                    <p className="text-xs text-blue-400 mt-1">{g.detail}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleSync(g.name)}>
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Sync
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Google Drive Folder Structure</CardTitle>
              <CardDescription className="text-xs">Receipts are organized automatically</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-xs text-muted-foreground space-y-1 bg-muted/20 rounded-lg p-4">
                <div>📁 Coinra Receipts/</div>
                <div className="ml-4">📁 2026-01/</div>
                <div className="ml-8">🖼️ receipt_stripe_2026-01-15.jpg</div>
                <div className="ml-8">🖼️ receipt_aws_2026-01-22.jpg</div>
                <div className="ml-4">📁 2026-02/</div>
                <div className="ml-4">📁 2026-03/</div>
                <div className="ml-4">📁 2026-04/ ← current</div>
                <div className="ml-8">🖼️ receipt_delta_2026-04-05.jpg</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accounting Policies */}
        <TabsContent value="accounting" className="mt-6 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Accounting Policies</CardTitle>
              <CardDescription className="text-xs">Configure how transactions are categorized and recorded</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Auto-categorize receipts with AI", description: "Use GPT-4o to automatically assign expense categories", enabled: true },
                { label: "Flag duplicate invoices", description: "Detect potential duplicates using fuzzy matching on vendor + amount + date", enabled: true },
                { label: "Require PO matching for invoices > $1,000", description: "3-way PO matching required for large invoices", enabled: true },
                { label: "Auto-convert foreign currencies", description: "Use live exchange rates to convert to base currency (EUR)", enabled: true },
                { label: "Send payment confirmation emails", description: "Notify vendors when payments are processed", enabled: false },
                { label: "Auto-sync to ERP on approval", description: "Push approved invoices to connected ERP immediately", enabled: true },
              ].map((policy) => (
                <div key={policy.label} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/20 border border-border/50">
                  <div>
                    <p className="text-sm font-medium">{policy.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{policy.description}</p>
                  </div>
                  <Switch defaultChecked={policy.enabled} onCheckedChange={() => toast.success("Policy updated")} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Base Currency & Exchange Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Base Currency</Label>
                  <Input defaultValue="EUR" className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Exchange Rate Source</Label>
                  <Input defaultValue="ECB (European Central Bank)" className="h-9 text-sm" />
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.success("Rates refreshed")}>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Refresh Rates
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Invoice approval required", description: "Notify when invoices need your approval" },
                { label: "Payment processed", description: "Confirm when payments are sent" },
                { label: "Overdue AR invoice", description: "Alert when customer invoices become overdue" },
                { label: "Duplicate invoice detected", description: "Flag potential duplicate submissions" },
                { label: "ERP sync completed", description: "Confirm successful ERP synchronization" },
                { label: "Weekly financial summary", description: "Weekly digest of AP/AR activity" },
              ].map((n) => (
                <div key={n.label} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/20 border border-border/50">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                  </div>
                  <Switch defaultChecked onCheckedChange={() => toast.success("Notification preference saved")} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
