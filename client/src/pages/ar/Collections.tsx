import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Bot, Mail, Phone, AlertTriangle, CheckCircle2, Clock, Send, Zap, TrendingDown } from "lucide-react";

const collectionsQueue = [
  {
    id: 1, customer: "Acme Corp", email: "ap@acme.com", invoiceNum: "AR-2026-001",
    amount: "$12,500", daysOverdue: 45, reminderCount: 3, nextAction: "Escalate to legal",
    sequence: "escalation", priority: "critical",
    history: [
      { date: "2026-03-16", action: "Invoice sent", type: "sent" },
      { date: "2026-04-16", action: "Reminder 1 sent (email)", type: "reminder" },
      { date: "2026-04-20", action: "Reminder 2 sent (email)", type: "reminder" },
      { date: "2026-04-22", action: "Reminder 3 sent (phone call)", type: "call" },
    ],
  },
  {
    id: 2, customer: "Retail Group", email: "billing@retailgroup.co", invoiceNum: "AR-2026-004",
    amount: "$3,100", daysOverdue: 22, reminderCount: 2, nextAction: "Send 3rd reminder",
    sequence: "standard", priority: "high",
    history: [
      { date: "2026-03-21", action: "Invoice sent", type: "sent" },
      { date: "2026-04-21", action: "Reminder 1 sent (email)", type: "reminder" },
      { date: "2026-04-22", action: "Reminder 2 sent (email)", type: "reminder" },
    ],
  },
  {
    id: 3, customer: "TechStart Ltd", email: "finance@techstart.io", invoiceNum: "AR-2026-002",
    amount: "$8,200", daysOverdue: 12, reminderCount: 1, nextAction: "Send 2nd reminder",
    sequence: "standard", priority: "medium",
    history: [
      { date: "2026-04-02", action: "Invoice sent", type: "sent" },
      { date: "2026-04-13", action: "Reminder 1 sent (email)", type: "reminder" },
    ],
  },
];

const priorityConfig: Record<string, { label: string; class: string; dot: string }> = {
  critical: { label: "Critical", class: "badge-red", dot: "bg-red-400" },
  high: { label: "High", class: "badge-amber", dot: "bg-amber-400" },
  medium: { label: "Medium", class: "badge-blue", dot: "bg-blue-400" },
  low: { label: "Low", class: "badge-gray", dot: "bg-gray-400" },
};

const actionTypeIcons: Record<string, React.ReactNode> = {
  sent: <Send className="h-3 w-3 text-blue-400" />,
  reminder: <Mail className="h-3 w-3 text-amber-400" />,
  call: <Phone className="h-3 w-3 text-purple-400" />,
  paid: <CheckCircle2 className="h-3 w-3 text-emerald-400" />,
};

export default function Collections() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = collectionsQueue.find((c) => c.id === selectedId);

  const handleSendReminder = (customer: string) => {
    toast.success(`AI reminder sent to ${customer}`, {
      description: "Personalized follow-up email generated and delivered",
    });
  };

  const handleAutomate = () => {
    toast.success("AI Collections Agent activated", {
      description: "All overdue invoices will be followed up automatically per your policy",
    });
  };

  return (
    <div className="p-6 max-w-[1400px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Collections Agent</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kolleno-inspired automated follow-up sequences for overdue invoices
          </p>
        </div>
        <Button onClick={handleAutomate} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Bot className="h-4 w-4 mr-2" />
          Activate AI Agent
        </Button>
      </div>

      {/* AI Agent Status Banner */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-semibold">AI Collections Agent Active</span>
            </div>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <span>3 invoices in queue</span>
              <span>2 reminders sent today</span>
              <span>$15,600 overdue balance</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">27% reduction in overdue (30 days)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Collections Queue</h2>
          {collectionsQueue.map((item) => {
            const priority = priorityConfig[item.priority];
            return (
              <Card
                key={item.id}
                className={`bg-card border cursor-pointer transition-all ${
                  selectedId === item.id ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"
                }`}
                onClick={() => setSelectedId(item.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm">{item.customer}</p>
                      <p className="text-xs text-muted-foreground">{item.invoiceNum}</p>
                    </div>
                    <Badge className={`text-[10px] px-2 ${priority.class}`}>{priority.label}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{item.amount}</span>
                    <span className={`text-xs font-medium ${item.daysOverdue > 30 ? "text-red-400" : "text-amber-400"}`}>
                      {item.daysOverdue}d overdue
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{item.reminderCount} reminders sent</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-blue-400 hover:text-blue-300"
                      onClick={(e) => { e.stopPropagation(); handleSendReminder(item.customer); }}
                    >
                      <Send className="h-3 w-3 mr-1" /> Remind
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          {!selected ? (
            <Card className="bg-card border-border h-full flex items-center justify-center">
              <CardContent className="text-center py-16">
                <Bot className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Select a collection item to view details</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-border">
              <CardHeader className="pb-3 border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{selected.customer}</CardTitle>
                    <CardDescription className="text-xs mt-1">{selected.email} · {selected.invoiceNum}</CardDescription>
                  </div>
                  <Badge className={`text-[10px] ${priorityConfig[selected.priority].class}`}>
                    {priorityConfig[selected.priority].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Amount Due", value: selected.amount, color: "text-red-400" },
                    { label: "Days Overdue", value: `${selected.daysOverdue}d`, color: "text-amber-400" },
                    { label: "Reminders", value: selected.reminderCount.toString(), color: "text-blue-400" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg bg-muted/20 p-3 text-center">
                      <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Next Action */}
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-semibold text-amber-400">Recommended Next Action</span>
                  </div>
                  <p className="text-sm">{selected.nextAction}</p>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Activity Timeline</h3>
                  <div className="space-y-3">
                    {selected.history.map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-muted/30 flex items-center justify-center shrink-0 mt-0.5">
                          {actionTypeIcons[h.type]}
                        </div>
                        <div>
                          <p className="text-sm">{h.action}</p>
                          <p className="text-xs text-muted-foreground">{h.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button className="flex-1" onClick={() => handleSendReminder(selected.customer)}>
                    <Mail className="h-4 w-4 mr-2" /> Send AI Reminder
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => toast.info("Dispute management coming soon")}>
                    <AlertTriangle className="h-4 w-4 mr-2" /> Mark Disputed
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => toast.success("Marked as paid!")}>
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Mark Paid
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
