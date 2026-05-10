import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Camera, Upload, Loader2, CheckCircle2, AlertTriangle,
  Sparkles, RefreshCw, Tag, FolderOpen, FileSpreadsheet
} from "lucide-react";

const CATEGORIES = ["Food & Drink", "Travel", "Office Supplies", "Software", "Utilities", "Other"] as const;
type Category = typeof CATEGORIES[number];

const categoryIcons: Record<Category, string> = {
  "Food & Drink": "🍽️",
  "Travel": "✈️",
  "Office Supplies": "📎",
  "Software": "💻",
  "Utilities": "⚡",
  "Other": "📦",
};

interface ExtractedData {
  vendor: string;
  date: string;
  total: string;
  currency: string;
  category: Category;
  lineItems: { description: string; amount: string }[];
  confidence: number;
}

export default function ReceiptCapture() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [projectTag, setProjectTag] = useState("");
  const [clientTag, setClientTag] = useState("");
  const [notes, setNotes] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const extractMutation = trpc.expenses.extractReceipt.useMutation({
    onSuccess: (data) => {
      setExtracted(data as ExtractedData);
      setIsExtracting(false);
      toast.success("Receipt extracted successfully!", { description: `${data.confidence}% confidence` });
    },
    onError: (err) => {
      setIsExtracting(false);
      toast.error("Extraction failed", { description: err.message });
    },
  });

  const saveMutation = trpc.expenses.saveExpense.useMutation({
    onSuccess: () => {
      setIsSaving(false);
      setSaved(true);
      toast.success("Receipt saved!", { description: "Stored to Google Drive & Google Sheets" });
    },
    onError: (err) => {
      setIsSaving(false);
      toast.error("Save failed", { description: err.message });
    },
  });

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    setSaved(false);
    setExtracted(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleExtract = async () => {
    if (!imageFile) return;
    setIsExtracting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      extractMutation.mutate({ imageBase64: base64, mimeType: imageFile.type });
    };
    reader.readAsDataURL(imageFile);
  };

  const handleSave = () => {
    if (!extracted || !imageFile) return;
    setIsSaving(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      saveMutation.mutate({
        imageBase64: base64,
        mimeType: imageFile.type,
        fileName: imageFile.name,
        vendor: extracted.vendor,
        date: extracted.date,
        total: extracted.total,
        currency: extracted.currency,
        category: extracted.category,
        lineItems: extracted.lineItems,
        projectTag,
        clientTag,
        notes,
      });
    };
    reader.readAsDataURL(imageFile);
  };

  return (
    <div className="p-6 max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Receipt Capture</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Capture a receipt with your camera or upload an image — AI extracts all data automatically
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upload */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Capture or Upload</CardTitle>
              <CardDescription className="text-xs">Supports JPG, PNG, PDF, HEIC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Preview area */}
              <div
                className="relative rounded-xl border-2 border-dashed border-border bg-muted/20 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                style={{ minHeight: 240 }}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Receipt" className="w-full h-full object-contain max-h-72" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-60 gap-3 text-muted-foreground">
                    <Upload className="h-10 w-10 opacity-40" />
                    <p className="text-sm">Drop receipt here or click to upload</p>
                    <p className="text-xs opacity-60">JPG, PNG, PDF, HEIC up to 10MB</p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Use Camera
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>

              {imageFile && !extracted && (
                <Button
                  className="w-full"
                  onClick={handleExtract}
                  disabled={isExtracting}
                >
                  {isExtracting ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Extracting with AI...</>
                  ) : (
                    <><Sparkles className="h-4 w-4 mr-2" /> Extract with AI OCR</>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* OCR Info */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">AI-Powered OCR</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    GPT-4o Vision extracts vendor, date, total, and line items with 98%+ accuracy. Auto-categorizes into 6 standard categories.
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { icon: FolderOpen, label: "Google Drive", sub: "Year-month folders" },
                  { icon: FileSpreadsheet, label: "Google Sheets", sub: "Auto-appended row" },
                  { icon: Tag, label: "Project Tags", sub: "Client & project" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30 text-center">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <p className="text-[10px] font-medium">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">{item.sub}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Extracted Data */}
        <div className="space-y-4">
          {!extracted && !isExtracting && (
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="h-16 w-16 rounded-2xl bg-muted/30 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">No receipt captured yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Upload or capture a receipt to extract data</p>
                </div>
              </CardContent>
            </Card>
          )}

          {isExtracting && (
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <div className="text-center">
                  <p className="text-sm font-medium">Analyzing receipt...</p>
                  <p className="text-xs text-muted-foreground mt-1">GPT-4o Vision is extracting data</p>
                </div>
              </CardContent>
            </Card>
          )}

          {extracted && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Extracted Data</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[10px] ${extracted.confidence >= 90 ? "badge-green" : "badge-amber"}`}>
                      {extracted.confidence}% confidence
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={handleExtract} className="h-7 px-2">
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Vendor</Label>
                    <Input
                      value={extracted.vendor}
                      onChange={(e) => setExtracted({ ...extracted, vendor: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Date</Label>
                    <Input
                      value={extracted.date}
                      onChange={(e) => setExtracted({ ...extracted, date: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Total</Label>
                    <Input
                      value={extracted.total}
                      onChange={(e) => setExtracted({ ...extracted, total: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Currency</Label>
                    <Input
                      value={extracted.currency}
                      onChange={(e) => setExtracted({ ...extracted, currency: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Category (auto-detected, override if needed)</Label>
                  <Select
                    value={extracted.category}
                    onValueChange={(v) => setExtracted({ ...extracted, category: v as Category })}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          <span className="mr-2">{categoryIcons[cat]}</span>{cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Line Items */}
                {extracted.lineItems.length > 0 && (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Line Items</Label>
                    <div className="rounded-lg border border-border overflow-hidden">
                      {extracted.lineItems.map((item, i) => (
                        <div key={i} className="flex justify-between px-3 py-2 text-xs border-b border-border/50 last:border-0">
                          <span className="text-muted-foreground">{item.description}</span>
                          <span className="font-medium">{item.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Project Tag</Label>
                    <Input
                      placeholder="e.g. Q2-Campaign"
                      value={projectTag}
                      onChange={(e) => setProjectTag(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Client Tag</Label>
                    <Input
                      placeholder="e.g. Acme Corp"
                      value={clientTag}
                      onChange={(e) => setClientTag(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Notes</Label>
                  <Textarea
                    placeholder="Optional notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="text-sm resize-none"
                    rows={2}
                  />
                </div>

                {saved ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-emerald-400">Saved successfully</p>
                      <p className="text-xs text-muted-foreground">Stored to Google Drive & Sheets</p>
                    </div>
                  </div>
                ) : (
                  <Button className="w-full" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                    ) : (
                      <><CheckCircle2 className="h-4 w-4 mr-2" /> Save Receipt</>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
