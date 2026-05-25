import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { chatWithNova } from "@/lib/ai.functions";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hey 👋 I'm Nova, your travel AI. Ask me about destinations, budgets, festivals — anything!" },
  ]);
  const chat = useServerFn(chatWithNova);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { content } = await chat({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: content || "…" }]);
    } catch (e: unknown) {
      setMessages([...next, { role: "assistant", content: `Sorry — ${e instanceof Error ? e.message : "something broke"}.` }]);
    } finally { setLoading(false); }
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: "spring" }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full gradient-sunset text-white grid place-items-center shadow-sunset hover:scale-110 transition"
        aria-label="Open AI chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[min(380px,calc(100vw-2rem))] h-[520px] rounded-3xl bg-card border border-border shadow-glow flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between gradient-ocean text-white">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/20 grid place-items-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-display text-base leading-tight">Nova AI</div>
                  <div className="text-[10px] uppercase tracking-widest opacity-80">Travel concierge</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 grid place-items-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                    m.role === "user" ? "gradient-sunset text-white rounded-br-sm" : "bg-card border border-border rounded-bl-sm"
                  }`}>{m.content}</div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-1 px-3.5 py-2.5"><Dot/><Dot d={0.15}/><Dot d={0.3}/></div>
              )}
              <div ref={endRef} />
            </div>

            <div className="p-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about Bali, Holi, budgets…"
                className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
              <button onClick={send} disabled={loading} className="w-10 h-10 rounded-full gradient-sunset text-white grid place-items-center disabled:opacity-50 hover:scale-105 transition">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Dot({ d = 0 }: { d?: number }) {
  return <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: d }} className="w-2 h-2 rounded-full bg-muted-foreground" />;
}
