import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from "lucide-react";

interface LineItem {
  id: number;
  description: string;
  qty: string;
  unit: string;
  amount: string;
}

const STEPS = ["Details", "Line Items", "Review & Submit"];

export default function CreatePO() {
  const [, setLocation] = useLocation();
  const [step, setStep]  = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    vendor: "", poNumber: "", date: "", deliveryDate: "",
    department: "", description: "", paymentTerms: "Net 30",
  });

  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: "", qty: "", unit: "", amount: "" },
  ]);

  const addItem = () => setItems(prev => [...prev, { id: Date.now(), description: "", qty: "", unit: "", amount: "" }]);
  const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id));
  const updateItem = (id: number, field: keyof LineItem, value: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));

  const total = items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);

  if (submitted) {
    return (
      <div className="p-6 max-w-lg mx-auto text-center mt-16">
        <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">PO Submitted for Approval</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Your purchase order has been sent to the approver. You will be notified once it is reviewed.
        </p>
        <div className="bg-secondary rounded-lg p-4 text-left mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">PO Number</span>
            <span className="font-medium">PO-000042</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Vendor</span>
            <span className="font-medium">{form.vendor || "Vendor Name"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="font-medium text-green-700">€{total.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" size="sm" onClick={() => setLocation("/procurement")}>
            Back to Purchase Orders
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90"
            onClick={() => { setSubmitted(false); setStep(0); setForm({ vendor: "", poNumber: "", date: "", deliveryDate: "", department: "", description: "", paymentTerms: "Net 30" }); setItems([{ id: 1, description: "", qty: "", unit: "", amount: "" }]); }}>
            Create Another PO
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[800px] space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => step === 0 ? setLocation("/procurement") : setStep(s => s - 1)}
          className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Create Purchase Order</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Step {step + 1} of {STEPS.length}</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center gap-2 ${i <= step ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                i < step ? "bg-primary border-primary text-white" :
                i === step ? "border-primary text-primary bg-white" :
                "border-border text-muted-foreground"
              }`}>
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-sm font-medium whitespace-nowrap">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-3 ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 — Details */}
      {step === 0 && (
        <div className="bg-white border border-border rounded-lg p-6 space-y-5">
          <h2 className="text-sm font-semibold">PO Details</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Vendor Name *",    key: "vendor",       placeholder: "e.g. AWS Ireland" },
              { label: "PO Number",        key: "poNumber",     placeholder: "Auto-generated if empty" },
              { label: "PO Date *",        key: "date",         placeholder: "DD/MM/YYYY", type: "date" },
              { label: "Delivery Date",    key: "deliveryDate", placeholder: "DD/MM/YYYY", type: "date" },
              { label: "Department",       key: "department",   placeholder: "e.g. Engineering" },
              { label: "Payment Terms",    key: "paymentTerms", placeholder: "Net 30" },
            ].map(f => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-xs font-medium">{f.label}</Label>
                <Input
                  type={f.type ?? "text"}
                  placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="h-9 text-sm" />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Description / Notes</Label>
            <textarea
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add any notes or description for this PO..."
              className="w-full h-20 text-sm px-3 py-2 rounded-md border border-border bg-background resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
        </div>
      )}

      {/* Step 2 — Line Items */}
      {step === 1 && (
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold">Line Items</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Add the items or services being procured</p>
          </div>
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-3 px-5 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/40 border-b border-border">
            <span>Description</span><span>Qty</span><span>Unit Price (€)</span><span>Total (€)</span><span></span>
          </div>
          <div className="divide-y divide-border">
            {items.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-3 px-5 py-3 items-center">
                <Input placeholder={`Item ${idx + 1} description`} value={item.description}
                  onChange={e => updateItem(item.id, "description", e.target.value)}
                  className="h-8 text-sm border-border" />
                <Input placeholder="1" value={item.qty} type="number"
                  onChange={e => updateItem(item.id, "qty", e.target.value)}
                  className="h-8 text-sm border-border" />
                <Input placeholder="0.00" value={item.unit} type="number"
                  onChange={e => {
                    const qty = parseFloat(item.qty) || 1;
                    const unit = parseFloat(e.target.value) || 0;
                    updateItem(item.id, "unit", e.target.value);
                    updateItem(item.id, "amount", (qty * unit).toFixed(2));
                  }}
                  className="h-8 text-sm border-border" />
                <Input placeholder="0.00" value={item.amount} readOnly
                  className="h-8 text-sm bg-secondary border-border font-mono" />
                <button onClick={() => items.length > 1 && removeItem(item.id)}
                  className="h-8 w-8 flex items-center justify-center rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-border flex items-center justify-between">
            <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={addItem}>
              <Plus className="h-3.5 w-3.5" /> Add Line Item
            </Button>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Total Amount</div>
              <div className="text-lg font-bold text-foreground font-mono">€{total.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3 — Review */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-white border border-border rounded-lg p-5 space-y-3">
            <h2 className="text-sm font-semibold">PO Summary</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Vendor",        form.vendor       || "Not set"],
                ["PO Number",     form.poNumber     || "PO-000042 (auto)"],
                ["PO Date",       form.date         || "Not set"],
                ["Delivery Date", form.deliveryDate || "Not set"],
                ["Department",    form.department   || "Not set"],
                ["Payment Terms", form.paymentTerms],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-secondary/40">
              <h2 className="text-sm font-semibold">Line Items ({items.length})</h2>
            </div>
            {items.filter(i => i.description).map(item => (
              <div key={item.id} className="flex items-center justify-between px-5 py-3 border-b border-border/60 text-sm">
                <span>{item.description}</span>
                <span className="font-mono font-medium">€{parseFloat(item.amount || "0").toLocaleString()}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-5 py-3 bg-secondary/40">
              <span className="text-sm font-semibold">Total</span>
              <span className="font-mono font-bold text-green-700">€{total.toLocaleString()}</span>
            </div>
          </div>
          {form.description && (
            <div className="bg-white border border-border rounded-lg p-5">
              <h2 className="text-sm font-semibold mb-2">Notes</h2>
              <p className="text-sm text-muted-foreground">{form.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={() => step === 0 ? setLocation("/procurement") : setStep(s => s - 1)}>
          {step === 0 ? "Cancel" : "Back"}
        </Button>
        <Button className="bg-primary hover:bg-primary/90"
          onClick={() => step < STEPS.length - 1 ? setStep(s => s + 1) : setSubmitted(true)}>
          {step === STEPS.length - 1 ? "Submit for Approval" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
