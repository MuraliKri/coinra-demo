import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from "recharts";
import { TrendingUp, Clock, AlertTriangle, CheckCircle2, Users, DollarSign, ArrowRight } from "lucide-react";

const dsoData = [
  { month: "Oct", dso: 42 },
  { month: "Nov", dso: 38 },
  { month: "Dec", dso: 45 },
  { month: "Jan", dso: 36 },
  { month: "Feb", dso: 34 },
  { month: "Mar", dso: 33 },
  { month: "Apr", dso: 32 },
];

const agingData = [
  { range: "Current", amount: 48000 },
  { range: "1-30 days", amount: 22000 },
  { range: "31-60 days", amount: 12000 },
  { range: "61-90 days", amount: 6000 },
  { range: "90+ days", amount: 2400 },
];

const collectionActivity = [
  { customer: "Acme Corp", amount: "$12,500", daysOverdue: 45, status: "overdue", reminders: 3 },
  { customer: "TechStart Ltd", amount: "$8,200", daysOverdue: 12, status: "sent", reminders: 1 },
  { customer: "Global Media", amount: "$5,600", daysOverdue: 0, status: "viewed", reminders: 0 },
  { customer: "Retail Group", amount: "$3,100", daysOverdue: 22, status: "overdue", reminders: 2 },
  { customer: "FinServ Inc.", amount: "$18,900", daysOverdue: 0, status: "paid", reminders: 0 },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  paid: { label: "Paid", class: "badge-green" },
  sent: { label: "Sent", class: "badge-blue" },
  viewed: { label: "Viewed", class: "badge-purple" },
  overdue: { label: "Overdue", class: "badge-red" },
  disputed: { label: "Disputed", class: "badge-amber" },
};

export default function AROverview() {
  const [, setLocation] = useLocation();

  return (
    <div className="p-6 max-w-[1400px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accounts Receivable</h1>
          <p className="text-muted-foreground text-sm mt-1">
            AI-powered collections — inspired by Kolleno's workflow
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setLocation("/ar/collections")}>
            <Users className="h-4 w-4 mr-2" />
            Collections
          </Button>
          <Button size="sm" onClick={() => setLocation("/ar/invoices")}>
            <TrendingUp className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Outstanding", value: "$88,000", sub: "+12% vs last month", icon: DollarSign, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Overdue (90+ days)", value: "$2,400", sub: "2 invoices at risk", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "DSO (Days)", value: "32", sub: "↓ 4 days vs last month", icon: Clock, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Collection Rate", value: "94%", sub: "Last 30 days", icon: CheckCircle2, color: "text-purple-400", bg: "bg-purple-500/10" },
        ].map((kpi) => (
          <Card key={kpi.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className={`h-8 w-8 rounded-lg ${kpi.bg} flex items-center justify-center mb-3`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
              <div className="text-xs text-muted-foreground/70 mt-1">{kpi.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* DSO Trend */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">DSO Trend</CardTitle>
            <CardDescription className="text-xs">Days Sales Outstanding — lower is better</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dsoData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[25, 50]} />
                <Tooltip
                  contentStyle={{ background: "#1e2130", border: "1px solid #2d3148", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${v} days`, "DSO"]}
                />
                <Line type="monotone" dataKey="dso" stroke="#22d3ee" strokeWidth={2.5} dot={{ fill: "#22d3ee", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AR Aging */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">AR Aging Buckets</CardTitle>
            <CardDescription className="text-xs">Outstanding by age</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={agingData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#1e2130", border: "1px solid #2d3148", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, "Amount"]}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}
                  fill="#6366f1"
                  label={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Collections Activity */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">AI Collections Activity</CardTitle>
            <CardDescription className="text-xs">Automated follow-up sequences — Kolleno-inspired workflow</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLocation("/ar/collections")}>
            View All <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  {["Customer", "Amount", "Days Overdue", "Reminders Sent", "Status", "Action"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {collectionActivity.map((item, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3 font-medium">{item.customer}</td>
                    <td className="px-4 py-3 font-semibold">{item.amount}</td>
                    <td className="px-4 py-3">
                      {item.daysOverdue > 0 ? (
                        <span className={`text-xs font-medium ${item.daysOverdue > 30 ? "text-red-400" : "text-amber-400"}`}>
                          {item.daysOverdue} days
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{item.reminders}</td>
                    <td className="px-4 py-3">
                      <Badge className={`text-[10px] px-2 ${statusConfig[item.status]?.class}`}>
                        {statusConfig[item.status]?.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {item.status !== "paid" && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => {}}>
                          Send Reminder
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
