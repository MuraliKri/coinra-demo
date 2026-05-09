import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Search, Send, MoreHorizontal, FileText, Eye, Mail } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const mockARInvoices = [
  { id: 1, invoiceNumber: "AR-2026-001", customerName: "Acme Corp", customerEmail: "ap@acme.com", issueDate: "2026-03-15", dueDate: "2026-04-15", amount: "12500.00", currency: "USD", status: "overdue", reminderCount: 3, paidAmount: "0" },
  { id: 2, invoiceNumber: "AR-2026-002", customerName: "TechStart Ltd", customerEmail: "finance@techstart.io", issueDate: "2026-04-01", dueDate: "2026-05-01", amount: "8200.00", currency: "USD", status: "sent", reminderCount: 1, paidAmount: "0" },
  { id: 3, invoiceNumber: "AR-2026-003", customerName: "Global Media", customerEmail: "accounts@globalmedia.com", issueDate: "2026-04-05", dueDate: "2026-05-05", amount: "5600.00", currency: "EUR", status: "viewed", reminderCount: 0, paidAmount: "0" },
  { id: 4, invoiceNumber: "AR-2026-004", customerName: "Retail Group", customerEmail: "billing@retailgroup.co", issueDate: "2026-03-20", dueDate: "2026-04-20", amount: "3100.00", currency: "USD", status: "overdue", reminderCount: 2, paidAmount: "0" },
  { id: 5, invoiceNumber: "AR-2026-005", customerName: "FinServ Inc.", customerEmail: "ap@finserv.com", issueDate: "2026-04-10", dueDate: "2026-05-10", amount: "18900.00", currency: "USD", status: "paid", reminderCount: 0, paidAmount: "18900.00" },
  { id: 6, invoiceNumber: "AR-2026-006", customerName: "StartupXYZ", customerEmail: "cfo@startupxyz.com", issueDate: "2026-04-15", dueDate: "2026-05-15", amount: "4500.00", currency: "USD", status: "draft", reminderCount: 0, paidAmount: "0" },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  draft: { label: "Draft", class: "badge-gray" },
  sent: { label: "Sent", class: "badge-blue" },
  viewed: { label: "Viewed", class: "badge-purple" },
  partial: { label: "Partial", class: "badge-amber" },
  paid: { label: "Paid", class: "badge-green" },
  overdue: { label: "Overdue", class: "badge-red" },
  disputed: { label: "Disputed", class: "badge-amber" },
};

export default function ARInvoices() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNew, setShowNew] = useState(false);
  const [lineItems, setLineItems] = useState([{ description: "", amount: "" }]);

  const filtered = mockARInvoices.filter((inv) => {
    const matchSearch = inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 max-w-[1400px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AR Invoices</h1>
          <p className="text-muted-foreground text-sm mt-1">Create, send, and track customer invoices</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Outstanding", value: "$29,800", class: "text-blue-400" },
          { label: "Overdue", value: "$15,600", class: "text-red-400" },
          { label: "Paid This Month", value: "$18,900", class: "text-emerald-400" },
          { label: "Avg Days to Pay", value: "28 days", class: "text-purple-400" },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${s.class}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search customer or invoice..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(statusConfig).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                {["Invoice #", "Customer", "Issue Date", "Due Date", "Amount", "Paid", "Reminders", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{inv.customerName}</div>
                    <div className="text-xs text-muted-foreground">{inv.customerEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{inv.issueDate}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{inv.dueDate}</td>
                  <td className="px-4 py-3 font-semibold">{inv.currency} {parseFloat(inv.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs">
                    {parseFloat(inv.paidAmount) > 0 ? (
                      <span className="text-emerald-400">{inv.currency} {parseFloat(inv.paidAmount).toLocaleString()}</span>
                    ) : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground text-center">{inv.reminderCount}</td>
                  <td className="px-4 py-3">
                    <Badge className={`text-[10px] px-2 ${statusConfig[inv.status]?.class}`}>
                      {statusConfig[inv.status]?.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info("Send invoice feature coming soon")}>
                          <Send className="mr-2 h-4 w-4 text-blue-400" /> Send Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Reminder sent!")}>
                          <Mail className="mr-2 h-4 w-4 text-amber-400" /> Send Reminder
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("View feature coming soon")}>
                          <Eye className="mr-2 h-4 w-4" /> View
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
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create AR Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Customer Name", placeholder: "Acme Corp" },
                { label: "Customer Email", placeholder: "ap@acme.com" },
                { label: "Invoice Number", placeholder: "AR-2026-007" },
                { label: "Due Date", placeholder: "YYYY-MM-DD" },
              ].map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{f.label}</Label>
                  <Input placeholder={f.placeholder} className="h-9 text-sm" />
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Line Items</Label>
              {lineItems.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <Input placeholder="Description" className="h-9 text-sm flex-1" />
                  <Input placeholder="Amount" className="h-9 text-sm w-28" />
                </div>
              ))}
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => setLineItems([...lineItems, { description: "", amount: "" }])}>
                + Add Line Item
              </Button>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Notes</Label>
              <Textarea placeholder="Payment terms, notes..." className="text-sm resize-none" rows={2} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { toast.success("Invoice saved as draft"); setShowNew(false); }}>
                Save Draft
              </Button>
              <Button className="flex-1" onClick={() => { toast.success("Invoice sent to customer!"); setShowNew(false); }}>
                <Send className="h-4 w-4 mr-2" /> Send Invoice
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
