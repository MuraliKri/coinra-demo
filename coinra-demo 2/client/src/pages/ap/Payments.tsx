import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ArrowRight, Zap, Globe, CreditCard, Clock,
  CheckCircle2, AlertCircle, Loader2, TrendingDown, Shield
} from "lucide-react";

const paymentMethods = [
  {
    id: "stablecoin_eurc",
    label: "EURC Stablecoin",
    description: "Circle EURC via Rain rails",
    badge: "Cross-border",
    badgeClass: "badge-blue",
    cost: "0.05–0.3%",
    speed: "< 2 minutes",
    icon: "🔵",
    best: "International vendors",
    color: "border-blue-500/30 bg-blue-500/5",
  },
  {
    id: "stablecoin_usdc",
    label: "USDC Stablecoin",
    description: "Circle USDC on-chain",
    badge: "Cross-border",
    badgeClass: "badge-purple",
    cost: "0.05–0.3%",
    speed: "< 2 minutes",
    icon: "🟣",
    best: "USD international",
    color: "border-purple-500/30 bg-purple-500/5",
  },
  {
    id: "fiat_sepa",
    label: "SEPA Transfer",
    description: "EU bank-to-bank transfer",
    badge: "Local EU",
    badgeClass: "badge-green",
    cost: "€0.20–€2.00",
    speed: "1–2 business days",
    icon: "🇪🇺",
    best: "EU local vendors",
    color: "border-emerald-500/30 bg-emerald-500/5",
  },
  {
    id: "fiat_ach",
    label: "ACH Transfer",
    description: "US bank-to-bank transfer",
    badge: "Local US",
    badgeClass: "badge-green",
    cost: "$0.25–$1.50",
    speed: "1–3 business days",
    icon: "🇺🇸",
    best: "US local vendors",
    color: "border-emerald-500/30 bg-emerald-500/5",
  },
];

const mockPayments = [
  { id: 1, vendor: "Stripe Inc.", amount: "4,200.00", currency: "USD", method: "stablecoin_usdc", status: "completed", date: "2026-04-20", txHash: "0x1a2b3c...4d5e", fee: "2.10" },
  { id: 2, vendor: "Shopify GmbH", amount: "8,500.00", currency: "EUR", method: "stablecoin_eurc", status: "completed", date: "2026-04-18", txHash: "0x9f8e7d...6c5b", fee: "4.25" },
  { id: 3, vendor: "WeWork", amount: "3,200.00", currency: "EUR", method: "fiat_sepa", status: "processing", date: "2026-04-22", txHash: null, fee: "0.50" },
  { id: 4, vendor: "Office Depot", amount: "320.00", currency: "USD", method: "fiat_ach", status: "completed", date: "2026-04-15", txHash: null, fee: "0.25" },
  { id: 5, vendor: "Figma", amount: "840.00", currency: "USD", method: "stablecoin_usdc", status: "pending", date: "2026-04-23", txHash: null, fee: "0.42" },
];

const methodLabels: Record<string, string> = {
  stablecoin_eurc: "EURC",
  stablecoin_usdc: "USDC",
  fiat_sepa: "SEPA",
  fiat_ach: "ACH",
};

const statusConfig: Record<string, { label: string; class: string }> = {
  completed: { label: "Completed", class: "badge-green" },
  processing: { label: "Processing", class: "badge-blue" },
  pending: { label: "Pending", class: "badge-amber" },
  failed: { label: "Failed", class: "badge-red" },
};

export default function Payments() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showNewPayment, setShowNewPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    if (!selectedMethod) { toast.error("Please select a payment method"); return; }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowNewPayment(false);
      toast.success("Payment initiated!", {
        description: selectedMethod.includes("stablecoin")
          ? "Stablecoin payment will settle in < 2 minutes"
          : "Bank transfer initiated — 1-2 business days",
      });
    }, 2000);
  };

  return (
    <div className="p-6 max-w-[1400px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Cross-border stablecoin (EURC/USDC) and local fiat (SEPA/ACH) payments
          </p>
        </div>
        <Button onClick={() => setShowNewPayment(true)}>
          <Zap className="h-4 w-4 mr-2" />
          New Payment
        </Button>
      </div>

      {/* Payment Rails Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {paymentMethods.map((method) => (
          <Card key={method.id} className={`bg-card border ${method.color} hover:border-primary/30 transition-colors`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{method.icon}</span>
                <Badge className={`text-[10px] ${method.badgeClass}`}>{method.badge}</Badge>
              </div>
              <h3 className="font-semibold text-sm">{method.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Cost</span>
                  <span className="font-medium text-emerald-400">{method.cost}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Speed</span>
                  <span className="font-medium">{method.speed}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Best for</span>
                  <span className="font-medium">{method.best}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cost Comparison Banner */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-emerald-400" />
              <span className="font-semibold text-sm">Save up to 96% vs SWIFT</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span>SWIFT: 3–7% + $25–$45 fee + 5 days</span>
              <ArrowRight className="h-3 w-3" />
              <span className="text-emerald-400 font-medium">EURC/USDC: 0.05–0.3% + &lt; 2 minutes</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">MiCA compliant · Circle regulated</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Payment History</CardTitle>
          <CardDescription className="text-xs">Recent outgoing payments</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  {["Vendor", "Amount", "Method", "Fee", "Status", "Date", "Tx Hash"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockPayments.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3 font-medium">{p.vendor}</td>
                    <td className="px-4 py-3 font-semibold">{p.currency} {p.amount}</td>
                    <td className="px-4 py-3">
                      <Badge className={`text-[10px] px-2 ${p.method.includes("stablecoin") ? "badge-blue" : "badge-green"}`}>
                        {methodLabels[p.method]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">${p.fee}</td>
                    <td className="px-4 py-3">
                      <Badge className={`text-[10px] px-2 ${statusConfig[p.status]?.class}`}>
                        {statusConfig[p.status]?.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.date}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {p.txHash ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* New Payment Dialog */}
      <Dialog open={showNewPayment} onOpenChange={setShowNewPayment}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Vendor</Label>
                <Input placeholder="Vendor name" className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Amount</Label>
                <Input placeholder="0.00" className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Currency</Label>
                <Select>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="USD" />
                  </SelectTrigger>
                  <SelectContent>
                    {["USD", "EUR", "GBP", "USDC", "EURC"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Invoice Ref</Label>
                <Input placeholder="INV-001" className="h-9 text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Payment Method</Label>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedMethod === method.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-muted/10 hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{method.icon}</span>
                      <span className="text-xs font-semibold">{method.label}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">{method.cost} · {method.speed}</div>
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full" onClick={handlePay} disabled={isProcessing}>
              {isProcessing ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
              ) : (
                <><Zap className="h-4 w-4 mr-2" /> Send Payment</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
