import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { Download, FileText, Loader2, TrendingUp, DollarSign, Calendar } from "lucide-react";

const vendorData = [
  { vendor: "Stripe", amount: 12400 },
  { vendor: "AWS", amount: 9800 },
  { vendor: "WeWork", amount: 8500 },
  { vendor: "Delta", amount: 5200 },
  { vendor: "Figma", amount: 3400 },
  { vendor: "Office Depot", amount: 1800 },
];

const trendData = [
  { month: "Jan", spend: 47000, revenue: 84000 },
  { month: "Feb", spend: 51000, revenue: 79000 },
  { month: "Mar", spend: 63000, revenue: 91000 },
  { month: "Apr", spend: 44000, revenue: 88000 },
];

const categoryPie = [
  { name: "Software", value: 32, color: "#6366f1" },
  { name: "Travel", value: 24, color: "#22d3ee" },
  { name: "Office Supplies", value: 18, color: "#a78bfa" },
  { name: "Utilities", value: 12, color: "#34d399" },
  { name: "Food & Drink", value: 9, color: "#fbbf24" },
  { name: "Other", value: 5, color: "#94a3b8" },
];

const reportTemplates = [
  { id: "monthly_ap", label: "Monthly AP Summary", description: "All AP invoices, payments, and vendor breakdown", icon: "📄" },
  { id: "ar_aging", label: "AR Aging Report", description: "Outstanding invoices by age bucket", icon: "📊" },
  { id: "expense_category", label: "Expense by Category", description: "Spend breakdown across all 6 categories", icon: "🏷️" },
  { id: "vendor_summary", label: "Vendor Summary", description: "Top vendors by spend with trend analysis", icon: "🏢" },
  { id: "cash_flow", label: "Cash Flow Report", description: "Inflows vs outflows over selected period", icon: "💰" },
  { id: "full_financial", label: "Full Financial Report", description: "Complete AP/AR/expense overview", icon: "📋" },
];

export default function Reports() {
  const [dateFrom, setDateFrom] = useState("2026-04-01");
  const [dateTo, setDateTo] = useState("2026-04-30");
  const [reportType, setReportType] = useState("full_financial");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMutation = trpc.reports.generate.useMutation({
    onSuccess: (data) => {
      setIsGenerating(false);
      if (data.url) {
        window.open(data.url, "_blank");
        toast.success("PDF report generated!", { description: "Opening in new tab" });
      }
    },
    onError: (err) => {
      setIsGenerating(false);
      toast.error("Generation failed", { description: (err as any).message });
    },
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    generateMutation.mutate({ dateFrom, dateTo, reportType });
  };

  return (
    <div className="p-6 max-w-[1400px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Generate PDF reports for any date range with category breakdowns and trend analysis
          </p>
        </div>
      </div>

      {/* Report Generator */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Generate Report</CardTitle>
          <CardDescription className="text-xs">Select date range and report type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap items-end">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">From</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 w-40" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">To</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9 w-40" />
            </div>
            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <Label className="text-xs text-muted-foreground">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTemplates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.icon} {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerate} disabled={isGenerating} className="h-9">
              {isGenerating ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
              ) : (
                <><Download className="h-4 w-4 mr-2" /> Generate PDF</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {reportTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => { setReportType(template.id); toast.info(`Selected: ${template.label}`); }}
            className={`p-4 rounded-xl border text-left transition-all ${
              reportType === template.id
                ? "border-primary/50 bg-primary/5"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <div className="text-2xl mb-2">{template.icon}</div>
            <div className="text-sm font-semibold">{template.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{template.description}</div>
          </button>
        ))}
      </div>

      {/* Preview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Vendor Breakdown */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top Vendors by Spend</CardTitle>
            <CardDescription className="text-xs">April 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={vendorData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="vendor" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={60} />
                <Tooltip
                  contentStyle={{ background: "#1e2130", border: "1px solid #2d3148", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, "Spend"]}
                />
                <Bar dataKey="amount" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Spend Trend */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Spend vs Revenue Trend</CardTitle>
            <CardDescription className="text-xs">Last 4 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#1e2130", border: "1px solid #2d3148", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, ""]}
                />
                <Line type="monotone" dataKey="spend" stroke="#f87171" strokeWidth={2} dot={{ r: 3 }} name="Spend" />
                <Line type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} name="Revenue" />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Pie */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Category Breakdown</CardTitle>
            <CardDescription className="text-xs">April 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={categoryPie} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                  {categoryPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#1e2130", border: "1px solid #2d3148", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${v}%`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {categoryPie.map((cat) => (
                <div key={cat.name} className="flex items-center gap-1.5 text-xs">
                  <div className="h-2 w-2 rounded-full shrink-0" style={{ background: cat.color }} />
                  <span className="text-muted-foreground truncate">{cat.name}</span>
                  <span className="ml-auto font-medium">{cat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
