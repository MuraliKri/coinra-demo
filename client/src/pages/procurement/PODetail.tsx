import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, CheckCircle2, Clock, XCircle,
  FileText, Download, MessageSquare, User, Calendar
} from "lucide-react";

const PO_DATA: Record<string, any> = {
  "PO-000041": {
    id: "PO-000041", vendor: "Tarun Daharwal", status: "pending",
    amount: "€11,000", date: "Apr 28, 2026", deliveryDate: "May 15, 2026",
    department: "Engineering", paymentTerms: "Net 30", category: "Software",
    description: "Annual software license renewal and support contract.",
    items: [
      { description: "Software License (Annual)", qty: 1, unit: 8000, total: 8000 },
      { description: "Support & Maintenance",     qty: 1, unit: 2000, total: 2000 },
      { description: "Onboarding Sessions",       qty: 2, unit: 500,  total: 1000 },
    ],
    timeline: [
      { event: "PO Created",          date: "Apr 28, 2026", user: "Krishna Nanda Kumar", done: true },
      { event: "Submitted for Approval", date: "Apr 28, 2026", user: "Krishna Nanda Kumar", done: true },
      { event: "Under Review",        date: "Pending",       user: "Finance Manager",     done: false },
      { event: "Approved / Declined", date: "—",             user: "—",                   done: false },
    ],
  },
  "PO-000040": {
    id: "PO-000040", vendor: "Delta Supplies", status: "active",
    amount: "€24,000", date: "Apr 25, 2026", deliveryDate: "May 10, 2026",
    department: "Operations", paymentTerms: "Net 45", category: "Office",
    description: "Office furniture and equipment for new Dublin office expansion.",
    items: [
      { description: "Standing Desks",    qty: 10, unit: 1200, total: 12000 },
      { description: "Ergonomic Chairs",  qty: 10, unit: 600,  total: 6000 },
      { description: "Monitor Stands",    qty: 10, unit: 150,  total: 1500 },
      { description: "Delivery & Setup",  qty: 1,  unit: 4500, total: 4500 },
    ],
    timeline: [
      { event: "PO Created",             date: "Apr 25, 2026", user: "Krishna Nanda Kumar", done: true },
      { event: "Submitted for Approval", date: "Apr 25, 2026", user: "Krishna Nanda Kumar", done: true },
      { event: "Approved",               date: "Apr 26, 2026", user: "Finance Manager",     done: true },
      { event: "Sent to Vendor",         date: "Apr 26, 2026", user: "System",              done: true },
    ],
  },
};

const statusConfig: Record<string, { badge: string; icon: any; label: string }> = {
  draft:    { badge: "badge-gray",  icon: FileText,     label: "Draft" },
  pending:  { badge: "badge-amber", icon: Clock,        label: "Pending Approval" },
  active:   { badge: "badge-blue",  icon: CheckCircle2, label: "Active" },
  approved: { badge: "badge-green", icon: CheckCircle2, label: "Approved" },
  declined: { badge: "badge-red",   icon: XCircle,      label: "Declined" },
};

export default function PODetail() {
  const params     = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const po = PO_DATA[params.id] ?? PO_DATA["PO-000041"];
  const cfg  = statusConfig[po.status];
  const Icon = cfg.icon;

  return (
    <div className="p-6 max-w-[1100px] space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setLocation("/procurement")}
            className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold tracking-tight">{po.id}</h1>
              <Badge className={`text-[10px] px-2 py-0 h-5 gap-1 ${cfg.badge}`}>
                <Icon className="h-2.5 w-2.5" />{cfg.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{po.vendor} — {po.category}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1.5">
            <Download className="h-3.5 w-3.5" /> Download PDF
          </Button>
          {po.status === "pending" && (
            <>
              <Button variant="outline" size="sm" className="text-xs text-red-600 border-red-200 hover:bg-red-50">
                Decline
              </Button>
              <Button size="sm" className="text-xs bg-primary hover:bg-primary/90">
                Approve PO
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left: Details + Line Items */}
        <div className="col-span-2 space-y-4">
          {/* Details card */}
          <div className="bg-white border border-border rounded-lg p-5">
            <h2 className="text-sm font-semibold mb-4">PO Details</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {[
                { icon: User,     label: "Vendor",         value: po.vendor },
                { icon: Calendar, label: "PO Date",        value: po.date },
                { icon: Calendar, label: "Delivery Date",  value: po.deliveryDate },
                { icon: FileText, label: "Department",     value: po.department },
                { icon: Clock,    label: "Payment Terms",  value: po.paymentTerms },
                { icon: FileText, label: "Category",       value: po.category },
              ].map(f => (
                <div key={f.label} className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <f.icon className="h-3 w-3" />{f.label}
                  </div>
                  <div className="font-medium">{f.value}</div>
                </div>
              ))}
            </div>
            {po.description && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground mb-1">Description</div>
                <p className="text-sm text-foreground">{po.description}</p>
              </div>
            )}
          </div>

          {/* Line items */}
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <h2 className="text-sm font-semibold">Line Items</h2>
            </div>
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/40 border-b border-border">
              <span>Description</span><span>Qty</span><span>Unit Price</span><span>Total</span>
            </div>
            {po.items.map((item: any, i: number) => (
              <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-border/60 text-sm">
                <span>{item.description}</span>
                <span className="text-muted-foreground">{item.qty}</span>
                <span className="font-mono">€{item.unit.toLocaleString()}</span>
                <span className="font-mono font-medium">€{item.total.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-5 py-3.5 bg-secondary/40">
              <span className="text-sm font-semibold">Total Amount</span>
              <span className="font-mono font-bold text-green-700 text-base">{po.amount}</span>
            </div>
          </div>
        </div>

        {/* Right: Timeline */}
        <div className="space-y-4">
          <div className="bg-white border border-border rounded-lg p-5">
            <h2 className="text-sm font-semibold mb-4">Approval Timeline</h2>
            <div className="space-y-0">
              {po.timeline.map((t: any, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                      t.done ? "bg-primary" : "bg-secondary border-2 border-border"
                    }`}>
                      {t.done
                        ? <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                        : <div className="h-2 w-2 rounded-full bg-border" />
                      }
                    </div>
                    {i < po.timeline.length - 1 && (
                      <div className={`w-px flex-1 my-1 ${t.done ? "bg-primary/30" : "bg-border"}`} style={{ minHeight: 24 }} />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className={`text-sm font-medium ${t.done ? "text-foreground" : "text-muted-foreground"}`}>
                      {t.event}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.user}</div>
                    <div className="text-xs text-muted-foreground">{t.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-5">
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Comments
            </h2>
            <div className="text-xs text-muted-foreground text-center py-4">
              No comments yet
            </div>
            <textarea placeholder="Add a comment..."
              className="w-full h-16 text-sm px-3 py-2 rounded-md border border-border bg-background resize-none focus:outline-none focus:ring-1 focus:ring-ring mt-2" />
            <Button size="sm" className="w-full mt-2 text-xs bg-primary hover:bg-primary/90">
              Post Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
