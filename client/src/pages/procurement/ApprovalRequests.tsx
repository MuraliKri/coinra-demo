import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, ChevronRight, Eye } from "lucide-react";

const REQUESTS = [
  { id: "PO-000041", vendor: "Tarun Daharwal",  amount: "€11,000", date: "Apr 28, 2026", category: "Software",  requestedBy: "Krishna NK", urgency: "normal" },
  { id: "PO-000038", vendor: "Green Logistics",  amount: "€18,000", date: "Apr 18, 2026", category: "Logistics", requestedBy: "Deepak Kumar", urgency: "urgent" },
];

export default function ApprovalRequests() {
  const [, setLocation] = useLocation();
  const [approved, setApproved] = useState<string[]>([]);
  const [declined, setDeclined] = useState<string[]>([]);

  const pending = REQUESTS.filter(r => !approved.includes(r.id) && !declined.includes(r.id));

  return (
    <div className="p-6 max-w-[900px] space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Approval Requests</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Purchase orders waiting for your approval
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending Review", value: pending.length, color: "text-amber-600",  bg: "bg-amber-50" },
          { label: "Approved",       value: approved.length, color: "text-green-700", bg: "bg-green-50" },
          { label: "Declined",       value: declined.length, color: "text-red-600",   bg: "bg-red-50" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-border rounded-lg p-4 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center`}>
              <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
            </div>
            <span className="text-sm text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold">Pending Your Approval</h2>
            <Badge className="badge-amber text-[10px]">{pending.length} pending</Badge>
          </div>
          {pending.map(req => (
            <div key={req.id} className="px-5 py-4 border-b border-border/60 hover:bg-secondary/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    req.urgency === "urgent" ? "bg-red-50" : "bg-amber-50"
                  }`}>
                    <Clock className={`h-4 w-4 ${req.urgency === "urgent" ? "text-red-500" : "text-amber-500"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{req.id}</span>
                      {req.urgency === "urgent" && (
                        <Badge className="badge-red text-[9px] px-1.5 py-0 h-4">Urgent</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {req.vendor} — {req.category} — Requested by {req.requestedBy} on {req.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold font-mono">{req.amount}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"
                      className="h-7 text-xs gap-1 text-muted-foreground"
                      onClick={() => setLocation(`/procurement/${req.id}`)}>
                      <Eye className="h-3 w-3" /> View
                    </Button>
                    <Button variant="outline" size="sm"
                      className="h-7 text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setDeclined(prev => [...prev, req.id])}>
                      <XCircle className="h-3 w-3" /> Decline
                    </Button>
                    <Button size="sm"
                      className="h-7 text-xs gap-1 bg-primary hover:bg-primary/90"
                      onClick={() => setApproved(prev => [...prev, req.id])}>
                      <CheckCircle2 className="h-3 w-3" /> Approve
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pending.length === 0 && (
        <div className="bg-white border border-border rounded-lg flex flex-col items-center justify-center py-16 text-center">
          <CheckCircle2 className="h-10 w-10 text-green-500 mb-3" />
          <p className="text-sm font-medium">All caught up!</p>
          <p className="text-xs text-muted-foreground mt-1">No purchase orders pending your approval</p>
        </div>
      )}

      {/* Recently actioned */}
      {(approved.length > 0 || declined.length > 0) && (
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border">
            <h2 className="text-sm font-semibold">Recently Actioned</h2>
          </div>
          {REQUESTS.filter(r => approved.includes(r.id) || declined.includes(r.id)).map(req => (
            <div key={req.id} className="flex items-center justify-between px-5 py-3.5 border-b border-border/60 text-sm">
              <div className="flex items-center gap-3">
                {approved.includes(req.id)
                  ? <CheckCircle2 className="h-4 w-4 text-green-600" />
                  : <XCircle className="h-4 w-4 text-red-500" />
                }
                <div>
                  <span className="font-medium">{req.id}</span>
                  <span className="text-muted-foreground ml-2">{req.vendor}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-medium">{req.amount}</span>
                <Badge className={approved.includes(req.id) ? "badge-green" : "badge-red"}>
                  {approved.includes(req.id) ? "Approved" : "Declined"}
                </Badge>
                <button onClick={() => setLocation(`/procurement/${req.id}`)}>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
