import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles, User, Loader2 } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQueries = [
  "How much did we pay Stripe last month?",
  "What are our top 5 vendors by spend this quarter?",
  "Show me all overdue AR invoices",
  "What's our current cash position?",
];

const mockResponses: Record<string, string> = {
  default: "Based on your current data, I can see your AP spend for April 2026 is €44,000, with 7 invoices pending approval. Your AR outstanding stands at €88,000 with 4 overdue invoices totalling €28,400 at risk. Would you like me to drill into any specific area?",
  stripe: "You paid Stripe Inc. a total of **€12,400** last month across 3 transactions: €4,200 on Apr 28, €5,800 on Apr 15, and €2,400 on Apr 3. All payments were processed via SEPA rail. Stripe is your #2 vendor by spend this quarter.",
  vendor: "Your top 5 vendors by spend this quarter are:\n\n1. **AWS** — €31,200\n2. **Stripe Inc.** — €18,600\n3. **Delta Airlines** — €14,800\n4. **Figma** — €8,400\n5. **Google Workspace** — €6,200\n\nTotal vendor spend this quarter: €142,800",
  overdue: "You have **4 overdue AR invoices** totalling €28,400:\n\n- Acme Corp — €12,500 (32 days overdue)\n- TechStart Ltd — €8,200 (18 days overdue)\n- Green Energy Co — €4,900 (12 days overdue)\n- Dublin Logistics — €2,800 (7 days overdue)\n\nShall I trigger automated payment reminders for these?",
  cash: "Your current net cash position is **€44,000**. Weekly breakdown:\n\n- W1: +€6,000 net\n- W2: +€9,000 net\n- W3: -€9,000 net (high outflow week)\n- W4: +€27,000 net\n\nYour EURC stablecoin balance is €127,450. MiCA rails are active.",
};

function getMockResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("stripe")) return mockResponses.stripe;
  if (q.includes("vendor") || q.includes("top")) return mockResponses.vendor;
  if (q.includes("overdue") || q.includes("ar invoice")) return mockResponses.overdue;
  if (q.includes("cash") || q.includes("position")) return mockResponses.cash;
  return mockResponses.default;
}

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: `## Welcome to Talk to Your Books 📊\n\nI'm your AI financial assistant with full access to your COINRA data. Ask me anything about your finances in plain English.\n\n**Try asking:**\n- "How much did we pay Stripe last month?"\n- "What's our current cash position?"\n- "Show me overdue AR invoices"`,
    timestamp: new Date(),
  },
];

export default function TalkToYourBooks() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const query = text ?? input.trim();
    if (!query) return;
    setInput("");
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: query, timestamp: new Date() }]);
    setIsLoading(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: getMockResponse(query), timestamp: new Date() }]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      <div className="p-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Talk to Your Books</h1>
            <p className="text-muted-foreground text-xs mt-0.5">Ask anything about your finances in natural language</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">AI Connected</span>
          </div>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {suggestedQueries.map((q) => (
            <button key={q} onClick={() => handleSend(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-secondary hover:border-primary/40 transition-all text-muted-foreground hover:text-foreground">
              {q}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === "assistant" ? "bg-primary" : "bg-secondary border border-border"}`}>
              {msg.role === "assistant" ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-foreground" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-primary text-white rounded-tr-sm" : "bg-white border border-border rounded-tl-sm"}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <p className={`text-[10px] mt-1.5 ${msg.role === "user" ? "text-white/60" : "text-muted-foreground"}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Analyzing your books...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 border-t border-border">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Input placeholder="Ask anything about your finances..." value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              className="pr-12 h-11 text-sm bg-white" disabled={isLoading} />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Sparkles className="h-4 w-4 text-muted-foreground/40" />
            </div>
          </div>
          <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading} className="h-11 px-4 bg-primary hover:bg-primary/90">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
