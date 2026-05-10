import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus, Search, Filter, Download, RefreshCw,
  Clock, CheckCircle2, XCircle, FileText, ChevronRight
} from "lucide-react";

const TABS = ["All", "Drafts", "Active", "Pending Approval", "History"];

const POs = [
  { id: "PO-000041", vendor: "Tarun Daharwal",  amount: "€11,000", date: "Apr 28, 2026", status: "pending",  items: 3, category: "Software" },
  { id: "PO-000040", vendor: "Delta Supplies",  amount: "€24,000", date: "Apr 25, 2026", status: "active",   items: 7, category: "Office" },
  { id: "PO-000039", vendor: "AWS Ireland",     amount: "€8,400",  date: "Apr 22, 2026", status: "approved", items: 1, category: "Cloud" },
  { id: "PO-000038", vendor: "Green Logistics", amount: "€18,000", date: "Apr 18, 2026", status: "draft",    items: 5, category: "Logistics" },
  { id: "PO-000037", vendor: "Acme Corp",       amount: "€31,200", date: "Apr 15, 2026", status: "declined", items: 4, category: "Hardware" },
  { id: "PO-000036", vendor: "Stripe Inc.",     amount: "€4,200",  date: "Apr 10, 2026", status: "approved", items: 1, category: "Software" },
  { id: "PO-000035", vendor: "Figma",           amount: "€2,800",  date: "Apr 05, 2026", status: "active",   items: 2, category: "Software" },
  { id: "PO-000034", vendor: "Tarun Daharwal",  amount: "€11,000", date: "Mar 28, 2026", status: "approved", items: 3, category: "Software" },
];

const statusConfig: Record<string, { badge: string; icon: any; label: string }> = {
  draft:    { badge: "badge-gray",  icon: FileText,     label: "Draft" },
  pending:  { badge: "badge-amber", icon: Clock,        label: "Pending Approval" },
  active:   { badge: "badge-blue",  icon: RefreshCw,    label: "Active" },
  approved: { badge: "badge-green", icon: CheckCircle2, label: "Approved" },
  declined: { badge: "badge-red",   icon: XCircle,      label: "Declined" },
};

const tabFilter: Record<string, string[]> = {
  "All":              ["draft","pending","active","approved","declined"],
  "Drafts":           ["draft"],
  "Active":           ["active"],
  "Pending Approval": ["pending"],
  "History":          ["approved","declined"],
};

export default function PurchaseOrders() {
  const [tab, setTab]       = useState("All");
  const [search, setSearch] = useState("");
  const [, setLocation]     = useLocation();

  const filtered = POs.filter(po =>
    tabFilter[tab].includes(po.status) &&
    (po.vendor.toLowerCase().includes(search.toLowerCase()) ||
     po.id.toLowerCase().includes(search.toLowerCase()))
  );

  const pendingCount = POs.filter(p => p.status === "pending").length;
  const draftCount   = POs.filter(p => p.status === "draft").length;

  return (
    <div className="p-6 max-w-[1200px] space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Purchase Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage procurement and supplier POs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button size="sm" className="text-xs gap-1.5 bg-primary hover:bg-primary/90"
            onClick={() => setLocation("/procurement/create")}>
            <Plus className="h-3.5 w-3.5" /> Create PO
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total POs",        value: String(POs.length), color: "text-foreground" },
          { label: "Pending Approval", value: String(pendingCount), color: "text-amber-600" },
          { label: "Drafts",           value: String(draftCount),   color: "text-muted-foreground" },
          { label: "Total Value",      value: "€1,10,600",          color: "text-green-700" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-border rounded-lg p-4">
            <div className={`text-2xl font-bold tracking-tight ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4">
          <div className="flex">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  tab === t
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}>
                {t}
                {t === "Pending Approval" && pendingCount > 0 && (
                  <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 py-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search POs..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs w-52 bg-secondary border-0" />
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Filter className="h-3.5 w-3.5" /> Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_1fr_40px] gap-4 px-5 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border bg-secondary/40">
          <span>PO Number</span><span>Vendor</span><span>Category</span>
          <span>Date</span><span>Amount</span><span>Status</span><span></span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No purchase orders found</p>
            <p className="text-xs text-muted-foreground/60 mt-1 mb-4">Create your first PO to get started</p>
            <Button size="sm" className="text-xs bg-primary hover:bg-primary/90 gap-1.5"
              onClick={() => setLocation("/procurement/create")}>
              <Plus className="h-3.5 w-3.5" /> Create Purchase Order
            </Button>
          </div>
        ) : (
          filtered.map(po => {
            const cfg  = statusConfig[po.status];
            const Icon = cfg.icon;
            return (
              <div key={po.id}
                className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_1fr_40px] gap-4 px-5 py-3.5 border-b border-border/60 hover:bg-secondary/30 transition-colors cursor-pointer items-center"
                onClick={() => setLocation(`/procurement/${po.id}`)}>
                <span className="text-sm font-medium text-primary">{po.id}</span>
                <span className="text-sm">{po.vendor}</span>
                <span className="text-sm text-muted-foreground">{po.category}</span>
                <span className="text-sm text-muted-foreground">{po.date}</span>
                <span className="text-sm font-medium font-mono">{po.amount}</span>
                <Badge className={`text-[10px] px-2 py-0 h-5 gap-1 w-fit ${cfg.badge}`}>
                  <Icon className="h-2.5 w-2.5" />{cfg.label}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
