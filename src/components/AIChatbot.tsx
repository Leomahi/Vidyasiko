import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Mail, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

async function streamChat({
  messages,
  onDelta,
  onDone,
}: {
  messages: Msg[];
  onDelta: (t: string) => void;
  onDone: () => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok || !resp.body) {
    const err = await resp.json().catch(() => ({ error: "Failed" }));
    throw new Error(err.error || "Failed to start stream");
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let done = false;

  while (!done) {
    const { done: rd, value } = await reader.read();
    if (rd) break;
    buf += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const p = JSON.parse(json);
        const c = p.choices?.[0]?.delta?.content as string | undefined;
        if (c) onDelta(c);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }
  onDone();
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    setLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: upsert,
        onDone: () => setLoading(false),
      });
    } catch (e) {
      console.error(e);
      setLoading(false);
      setMessages((p) => [
        ...p,
        { role: "assistant", content: "Sorry, I'm having trouble right now. Please try again or contact support below! 👇" },
      ]);
      setShowContact(true);
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-3rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground rounded-t-2xl">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <div>
                  <p className="font-bold text-sm">VidyaQuest AI</p>
                  <p className="text-xs opacity-80">Ask me anything!</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="hover:bg-primary-foreground/20 rounded-full p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm mt-8 space-y-2">
                  <p className="text-3xl">🤖</p>
                  <p className="font-medium">Hi! I'm your study buddy.</p>
                  <p className="text-xs">Ask me about Math, Science, English, or Computer Science!</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:mt-1 [&>ol]:mt-1">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Contact info */}
            {showContact && (
              <div className="px-3 pb-2">
                <div className="bg-accent/50 rounded-xl p-3 text-xs space-y-1">
                  <p className="font-bold text-sm">Need more help? Contact us:</p>
                  <a href="mailto:mahendrasmahi09@gmail.com" className="flex items-center gap-1.5 text-primary hover:underline">
                    <Mail className="w-3.5 h-3.5" /> mahendrasmahi09@gmail.com
                  </a>
                  <a href="tel:7975135661" className="flex items-center gap-1.5 text-primary hover:underline">
                    <Phone className="w-3.5 h-3.5" /> 7975135661
                  </a>
                </div>
              </div>
            )}

            {/* Contact toggle + Input */}
            <div className="p-3 border-t border-border space-y-2">
              <button
                onClick={() => setShowContact((v) => !v)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {showContact ? "Hide contact info" : "📞 Need human help? Contact support"}
              </button>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="rounded-xl text-sm"
                  disabled={loading}
                />
                <Button type="submit" size="icon" disabled={loading || !input.trim()} className="rounded-xl shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
