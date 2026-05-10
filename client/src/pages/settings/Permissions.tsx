import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Shield, Users, Settings, Eye, Edit, Trash2, CheckCircle2 } from "lucide-react";

const roles = [
  {
    id: "admin",
    name: "Admin",
    description: "Full access to all features and settings",
    color: "badge-red",
    users: 1,
    permissions: {
      viewDashboard: true, captureReceipts: true, manageAPInvoices: true,
      approveInvoices: true, makePayments: true, manageARInvoices: true,
      viewReports: true, exportReports: true, manageUsers: true,
      configureIntegrations: true, setApprovalPolicies: true, viewAuditLog: true,
    },
  },
  {
    id: "cfo",
    name: "CFO",
    description: "Full financial visibility and approval authority",
    color: "badge-purple",
    users: 2,
    permissions: {
      viewDashboard: true, captureReceipts: true, manageAPInvoices: true,
      approveInvoices: true, makePayments: true, manageARInvoices: true,
      viewReports: true, exportReports: true, manageUsers: false,
      configureIntegrations: true, setApprovalPolicies: true, viewAuditLog: true,
    },
  },
  {
    id: "finance_manager",
    name: "Finance Manager",
    description: "Manage AP/AR, approve invoices up to threshold",
    color: "badge-blue",
    users: 3,
    permissions: {
      viewDashboard: true, captureReceipts: true, manageAPInvoices: true,
      approveInvoices: true, makePayments: false, manageARInvoices: true,
      viewReports: true, exportReports: true, manageUsers: false,
      configureIntegrations: false, setApprovalPolicies: false, viewAuditLog: true,
    },
  },
  {
    id: "ap_clerk",
    name: "AP Clerk",
    description: "Create and submit invoices for approval",
    color: "badge-amber",
    users: 4,
    permissions: {
      viewDashboard: true, captureReceipts: true, manageAPInvoices: true,
      approveInvoices: false, makePayments: false, manageARInvoices: false,
      viewReports: false, exportReports: false, manageUsers: false,
      configureIntegrations: false, setApprovalPolicies: false, viewAuditLog: false,
    },
  },
  {
    id: "approver",
    name: "Approver",
    description: "Review and approve/reject submitted invoices",
    color: "badge-green",
    users: 2,
    permissions: {
      viewDashboard: true, captureReceipts: false, manageAPInvoices: false,
      approveInvoices: true, makePayments: false, manageARInvoices: false,
      viewReports: true, exportReports: false, manageUsers: false,
      configureIntegrations: false, setApprovalPolicies: false, viewAuditLog: false,
    },
  },
  {
    id: "view_only",
    name: "View Only",
    description: "Read-only access to reports and dashboards",
    color: "badge-gray",
    users: 5,
    permissions: {
      viewDashboard: true, captureReceipts: false, manageAPInvoices: false,
      approveInvoices: false, makePayments: false, manageARInvoices: false,
      viewReports: true, exportReports: false, manageUsers: false,
      configureIntegrations: false, setApprovalPolicies: false, viewAuditLog: false,
    },
  },
];

const permissionLabels: Record<string, string> = {
  viewDashboard: "View Dashboard",
  captureReceipts: "Capture Receipts",
  manageAPInvoices: "Manage AP Invoices",
  approveInvoices: "Approve Invoices",
  makePayments: "Make Payments",
  manageARInvoices: "Manage AR Invoices",
  viewReports: "View Reports",
  exportReports: "Export Reports",
  manageUsers: "Manage Users",
  configureIntegrations: "Configure Integrations",
  setApprovalPolicies: "Set Approval Policies",
  viewAuditLog: "View Audit Log",
};

const approvalPolicies = [
  { id: 1, name: "Standard AP Approval", trigger: "Invoice > $1,000", approvers: ["Finance Manager"], chain: "Sequential", active: true },
  { id: 2, name: "Large Payment Approval", trigger: "Payment > $10,000", approvers: ["CFO", "Admin"], chain: "Sequential", active: true },
  { id: 3, name: "Stablecoin Payment", trigger: "Any stablecoin payment", approvers: ["CFO"], chain: "Single", active: true },
  { id: 4, name: "Vendor Onboarding", trigger: "New vendor added", approvers: ["Finance Manager", "CFO"], chain: "Sequential", active: false },
];

export default function Permissions() {
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [showNewPolicy, setShowNewPolicy] = useState(false);

  return (
    <div className="p-6 max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Permissions & Approval Policies</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure role-based access control and approval workflows
        </p>
      </div>

      {/* RBAC Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role List */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Roles</h2>
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={`w-full p-3 rounded-xl border text-left transition-all ${
                selectedRole.id === role.id
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{role.name}</span>
                <Badge className={`text-[10px] ${role.color}`}>{role.users} users</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{role.description}</p>
            </button>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => toast.info("Custom roles coming soon")}>
            <Plus className="h-4 w-4 mr-2" /> Create Custom Role
          </Button>
        </div>

        {/* Permission Matrix */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{selectedRole.name} Permissions</CardTitle>
                  <CardDescription className="text-xs mt-1">{selectedRole.description}</CardDescription>
                </div>
                <Badge className={`${selectedRole.color}`}>{selectedRole.users} users</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(permissionLabels).map(([key, label]) => {
                  const enabled = selectedRole.permissions[key as keyof typeof selectedRole.permissions];
                  return (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50">
                      <div className="flex items-center gap-2">
                        {enabled ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                        )}
                        <span className={`text-xs ${enabled ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={() => toast.info("Permission changes require admin confirmation")}
                        className="scale-75"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approval Policies */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Approval Policies</h2>
            <p className="text-xs text-muted-foreground mt-1">Configure when and who needs to approve transactions</p>
          </div>
          <Button size="sm" onClick={() => setShowNewPolicy(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Policy
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {approvalPolicies.map((policy) => (
            <Card key={policy.id} className={`bg-card border ${policy.active ? "border-border" : "border-border/40 opacity-60"}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-sm">{policy.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{policy.trigger}</p>
                  </div>
                  <Switch
                    checked={policy.active}
                    onCheckedChange={() => toast.info("Policy updated")}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Approvers:</span>
                    <div className="flex gap-1">
                      {policy.approvers.map((a) => (
                        <Badge key={a} className="text-[10px] badge-blue px-1.5">{a}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Chain:</span>
                    <span className="font-medium">{policy.chain}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* New Policy Dialog */}
      <Dialog open={showNewPolicy} onOpenChange={setShowNewPolicy}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Approval Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {[
              { label: "Policy Name", placeholder: "e.g. Large Payment Approval" },
              { label: "Trigger Condition", placeholder: "e.g. Invoice > $5,000" },
            ].map((f) => (
              <div key={f.label} className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{f.label}</Label>
                <Input placeholder={f.placeholder} className="h-9 text-sm" />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Approver Role</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Approval Chain</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Sequential" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequential">Sequential (one by one)</SelectItem>
                  <SelectItem value="parallel">Parallel (all at once)</SelectItem>
                  <SelectItem value="single">Single approver</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={() => { toast.success("Policy created"); setShowNewPolicy(false); }}>
              Create Policy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
