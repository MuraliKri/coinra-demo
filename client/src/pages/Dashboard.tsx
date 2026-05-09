import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  ArrowUpRight, ArrowDownRight, Clock, TrendingUp,
  AlertTriangle, CheckCircle2, DollarSign, FileText,
  CreditCard, Users, Zap, ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const monthlySpend = [
  { month: "Oct", ap: 42000, ar: 68000 },
  { month: "Nov", ap: 38500, ar: 72000 },
  { month: "Dec", ap: 55000, ar: 61000 },
  { month: "Jan", ap: 47000, ar: 84000 },
  { month: "Feb", ap: 51000, ar: 79000 },
  { month: "Mar", ap: 63000, ar: 91000 },
  { month: "Apr", ap: 44000, ar: 88000 },
];

const categoryData = [
  { name: "Software",        value: 32, color: "#1a3c2e" },
  { name: "Travel",          value: 24, color: "#1db954" },
  { name: "Office Supplies", value: 18, color: "#22543d" },
  { name: "Utilities",       value: 12, color: "#2d6a4f" },
  { name: "Food & Drink",    value: 9,  color: "#fbbf24" },
  { name: "Other",           value: 5,  color: "#ddddd4" },
];

const cashflowData = [
  { week: "W1", inflow: 24000, outflow: 18000 },
  { week: "W2", inflow: 31000, outflow: 22000 },
  { week: "W3", inflow: 19000, outflow: 28000 },
  { week: "W4", inflow: 42000, outflow: 15000 },
];

const recentActivity = [
  { id: 1, vendor: "Stripe Inc.",   amount: "€4,200",  time: "2m ago",  status: "paid" },
  { id: 2, vendor: "Delta Airlines",amount: "€1,840",  time: "14m ago", status: "pending" },
  { id: 3, vendor: "AWS",           amount: "€3,100",  time: "1h ago",  status: "flagged" },
  { id: 4, vendor: "Acme Corp",     amount: "€12,500", time: "2h ago",  status: "overdue" },
  { id: 5, vendor: "Figma",         amount: "€840",    time: "3h ago",  status: "paid" },
];

const kpis = [
  {
    label: "AP This Month",
    value: "€44,000",
    change: "+8.2%",
    up: false,
    icon: CreditCard,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "AR Outstanding",
    value: "€88,000",
    change: "+12.4%",
    up: true,
    icon: TrendingUp,
    iconBg: "bg-green-50",
    iconColor: "text-green-700",
  },
  {
    label: "Pending Approvals",
    value: "7",
    change: "3 urgent",
    up: false,
    icon: Clock,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    label: "Overdue Invoices",
    value: "4",
    change: "€28,400 at risk",
    up: false,
    icon: AlertTriangle,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    label: "DSO (Days)",
    value: "32",
    change: "4 days faster",
    up: true,
    icon: Users,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    label: "Receipts Captured",
    value: "143",
    change: "This month",
    up: true,
    icon: FileText,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
];

const statusConfig: Record<string, { badge: string; label: string }> = {
  paid:    { badge: "badge-green",  label: "Paid" },
  pending: { badge: "badge-amber",  label: "Pending" },
  flagged: { badge: "badge-red",    label: "Flagged" },
  overdue: { badge: "badge-red",    label: "Overdue" },
};

const tooltipStyle = {
  background: "#ffffff",
  border: "1px solid #ddddd4",
  borderRadius: 6,
  fontSize: 12,
  color: "#111a13",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
};

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Good morning, {user?.name?.split(" ")[0] ?? "CFO"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Financial overview for April 2026
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation("/ap/receipts")}
            className="text-xs border-border text-foreground hover:bg-secondary"
          >
            <Zap className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
            Capture Receipt
          </Button>
          <Button
            size="sm"
            onClick={() => setLocation("/reports")}
            className="text-xs bg-primary text-white hover:bg-primary/90"
          >
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* ── Trust bar (Round Treasury pattern) ── */}
      <div className="flex items-center gap-4 py-2.5 px-4 bg-white border border-border rounded-lg">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] font-medium text-green-700 uppercase tracking-wider">MiCA Compliant</span>
        </div>
        <div className="h-3 w-px bg-border" />
        <span className="text-[11px] text-muted-foreground">EURC rails active</span>
        <div className="h-3 w-px bg-border" />
        <span className="text-[11px] text-muted-foreground">Last sync: 2 min ago</span>
        <div className="ml-auto text-[11px] text-muted-foreground tabular-nums">
          Net position: <span className="font-semibold text-foreground">€44,000</span>
        </div>
      </div>

      {/* ── KPI Cards (Ramp layout, Round Treasury numbers) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((kpi) => (
          <Card
            key={kpi.label}
            className="bg-white border-border card-hover cursor-default"
          >
            <CardContent className="p-4">
              <div className={`h-7 w-7 rounded-md ${kpi.iconBg} flex items-center justify-center mb-3`}>
                <kpi.icon className={`h-3.5 w-3.5 ${kpi.iconColor}`} />
              </div>
              <div className="kpi-value text-[22px] text-foreground leading-none mb-1">
                {kpi.value}
              </div>
              <div className="text-[11px] text-muted-foreground leading-tight mb-1.5">
                {kpi.label}
              </div>
              <div className={`text-[11px] font-medium flex items-center gap-0.5 ${
                kpi.up ? "text-green-700" : "text-muted-foreground"
              }`}>
                {kpi.up && <ArrowUpRight className="h-3 w-3" />}
                {kpi.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* AP/AR Trend */}
        <Card className="lg:col-span-2 bg-white border-border">
          <CardHeader className="pb-1 pt-4 px-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-foreground">AP vs AR Trend</CardTitle>
                <CardDescription className="text-xs mt-0.5">Last 7 months</CardDescription>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#1a3c2e]" />AP
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#1db954]" />AR
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlySpend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="apGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1a3c2e" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#1a3c2e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="arGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1db954" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1db954" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ea" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7a8a7e" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#7a8a7e" }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `€${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`€${v.toLocaleString()}`, ""]} />
                <Area type="monotone" dataKey="ap" stroke="#1a3c2e" strokeWidth={1.5} fill="url(#apGrad)" name="AP" />
                <Area type="monotone" dataKey="ar" stroke="#1db954" strokeWidth={1.5} fill="url(#arGrad)" name="AR" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="bg-white border-border">
          <CardHeader className="pb-1 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-foreground">Spend by Category</CardTitle>
            <CardDescription className="text-xs mt-0.5">April 2026</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={2} dataKey="value">
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-1">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-sm" style={{ background: cat.color }} />
                    <span className="text-[11px] text-muted-foreground">{cat.name}</span>
                  </div>
                  <span className="text-[11px] font-medium tabular-nums text-foreground">{cat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Charts Row 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Cash Flow */}
        <Card className="bg-white border-border">
          <CardHeader className="pb-1 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-foreground">Cash Flow</CardTitle>
            <CardDescription className="text-xs mt-0.5">Weekly inflow vs outflow</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={cashflowData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ea" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#7a8a7e" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#7a8a7e" }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `€${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`€${v.toLocaleString()}`, ""]} />
                <Bar dataKey="inflow"  fill="#1db954" radius={[3, 3, 0, 0]} name="Inflow" />
                <Bar dataKey="outflow" fill="#f0f0ea" radius={[3, 3, 0, 0]} name="Outflow"
                  stroke="#ddddd4" strokeWidth={1} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity (Kolleno-style transaction list) */}
        <Card className="lg:col-span-2 bg-white border-border">
          <CardHeader className="pb-1 pt-4 px-5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">Recent Activity</CardTitle>
              <CardDescription className="text-xs mt-0.5">Latest financial events</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 px-2">
              View all <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="px-5 pb-2">
            {recentActivity.map((item) => (
              <div key={item.id} className="data-row flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <div className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 ${
                    item.status === "paid"    ? "bg-green-50" :
                    item.status === "pending" ? "bg-amber-50" :
                    "bg-red-50"
                  }`}>
                    {item.status === "paid"
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      : item.status === "pending"
                      ? <Clock className="h-3.5 w-3.5 text-amber-600" />
                      : <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{item.vendor}</p>
                    <p className="text-[11px] text-muted-foreground">{item.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="amount font-medium text-foreground">{item.amount}</span>
                  <Badge className={`text-[10px] px-2 py-0 h-5 ${statusConfig[item.status]?.badge}`}>
                    {statusConfig[item.status]?.label}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Quick Actions (Ramp bottom bar pattern) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Capture Receipt",   icon: FileText,    path: "/ap/receipts",  iconBg: "bg-blue-50",   iconColor: "text-blue-600" },
          { label: "New AP Invoice",    icon: CreditCard,  path: "/ap/invoices",  iconBg: "bg-purple-50", iconColor: "text-purple-600" },
          { label: "Create AR Invoice", icon: TrendingUp,  path: "/ar/invoices",  iconBg: "bg-green-50",  iconColor: "text-green-700" },
          { label: "Talk to Your Books",icon: DollarSign,  path: "/chat",         iconBg: "bg-amber-50",  iconColor: "text-amber-600" },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => setLocation(action.path)}
            className="flex items-center gap-3 p-3.5 rounded-lg border border-border bg-white card-hover text-left group"
          >
            <div className={`h-8 w-8 rounded-md ${action.iconBg} flex items-center justify-center shrink-0`}>
              <action.icon className={`h-4 w-4 ${action.iconColor}`} />
            </div>
            <span className="text-sm font-medium text-foreground">{action.label}</span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

    </div>
  );
}
