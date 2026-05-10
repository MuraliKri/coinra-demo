import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Plus, Search, Filter, AlertTriangle, CheckCircle2,
  Clock, XCircle, FileText, Download, MoreHorizontal,
  ArrowUpDown, ChevronDown, Loader2
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const statusConfig: Record<string, { label: string; class: string }> = {
  draft: { label: "Draft", class: "badge-gray" },
  pending_approval: { label: "Pending Approval", class: "badge-amber" },
  approved: { label: "Approved", class: "badge-blue" },
  paid: { label: "Paid", class: "badge-green" },
  overdue: { label: "Overdue", class: "badge-red" },
  rejected: { label: "Rejected", class: "badge-red" },
};

const mockInvoices = [
  { id: 1, vendorName: "Stripe Inc.", invoiceNumber: "INV-2024-001", issueDate: "2026-04-01", dueDate: "2026-04-30", amount: "4200.00", currency: "USD", category: "Software", status: "paid", isDuplicate: false, poMatched: true },
  { id: 2, vendorName: "Delta Airlines", invoiceNumber: "INV-2024-002", issueDate: "2026-04-05", dueDate: "2026-05-05", amount: "1840.00", currency: "USD", category: "Travel", status: "pending_approval", isDuplicate: false, poMatched: false },
  { id: 3, vendorName: "AWS", invoiceNumber: "INV-2024-003", issueDate: "2026-04-08", dueDate: "2026-04-22", amount: "3100.00", currency: "USD", category: "Software", status: "overdue", isDuplicate: true, poMatched: true },
  { id: 4, vendorName: "WeWork", invoiceNumber: "INV-2024-004", issueDate: "2026-04-10", dueDate: "2026-05-10", amount: "8500.00", currency: "EUR", category: "Utilities", status: "approved", isDuplicate: false, poMatched: true },
  { id: 5, vendorName: "Figma", invoiceNumber: "INV-2024-005", issueDate: "2026-04-12", dueDate: "2026-05-12", amount: "840.00", currency: "USD", category: "Software", status: "paid", isDuplicate: false, poMatched: true },
  { id: 6, vendorName: "Office Depot", invoiceNumber: "INV-2024-006", issueDate: "2026-04-15", dueDate: "2026-05-15", amount: "320.00", currency: "USD", category: "Office Supplies", status: "draft", isDuplicate: false, poMatched: false },
];

export default function APInvoices() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewInvoice, setShowNewInvoice] = useState(false);

  const filtered = mockInvoices.filter((inv) => {
    const matchSearch = inv.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totals = {
    pending: mockInvoices.filter(i => i.status === "pending_approval").length,
    overdue: mockInvoices.filter(i => i.status === "overdue").length,
    duplicates: mockInvoices.filter(i => i.isDuplicate).length,
    totalAmount: mockInvoices.reduce((s, i) => s + parseFloat(i.amount), 0),
  };

  return (
    <div className="p-6 max-w-[1400px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AP Invoices</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage supplier invoices, approvals, and payments</p>
        </div>
        <Button onClick={() => setShowNewInvoice(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending Approval", value: totals.pending, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Overdue", value: totals.overdue, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Duplicate Flags", value: totals.duplicates, icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10" },
          { label: "Total This Month", value: `$${totals.totalAmount.toLocaleString()}`, icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
        ].map((card) => (
          <Card key={card.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className={`h-8 w-8 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendor or invoice number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44 h-9">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(statusConfig).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-9">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Table */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vendor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Invoice #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Due Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Flags</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium">{inv.vendorName}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{inv.dueDate}</td>
                  <td className="px-4 py-3 font-semibold">
                    {inv.currency} {parseFloat(inv.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">{inv.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`text-[10px] px-2 ${statusConfig[inv.status]?.class ?? "badge-gray"}`}>
                      {statusConfig[inv.status]?.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {inv.isDuplicate && (
                        <Badge className="text-[10px] px-1.5 badge-red">Duplicate</Badge>
                      )}
                      {!inv.poMatched && inv.status !== "draft" && (
                        <Badge className="text-[10px] px-1.5 badge-amber">No PO</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info("Approve feature coming soon")}>
                          <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" /> Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Pay feature coming soon")}>
                          <FileText className="mr-2 h-4 w-4 text-blue-400" /> Pay Now
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Reject feature coming soon")} className="text-destructive">
                          <XCircle className="mr-2 h-4 w-4" /> Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Invoice Dialog */}
      <Dialog open={showNewInvoice} onOpenChange={setShowNewInvoice}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New AP Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {[
              { label: "Vendor Name", placeholder: "e.g. Stripe Inc." },
              { label: "Invoice Number", placeholder: "INV-2024-001" },
              { label: "Amount", placeholder: "0.00" },
              { label: "Due Date", placeholder: "YYYY-MM-DD" },
              { label: "PO Number (optional)", placeholder: "PO-001" },
            ].map((field) => (
              <div key={field.label} className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{field.label}</Label>
                <Input placeholder={field.placeholder} className="h-9 text-sm" />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Category</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {["Food & Drink", "Travel", "Office Supplies", "Software", "Utilities", "Other"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full mt-2" onClick={() => { toast.success("Invoice created"); setShowNewInvoice(false); }}>
              Create Invoice
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
