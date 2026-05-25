import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Loader2, Hotel, Utensils, Wallet } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateItinerary } from "@/lib/ai.functions";

type Itinerary = Awaited<ReturnType<ReturnType<typeof useServerFn<typeof generateItinerary>>>>;

export function AIPlanner() {
  const [form, setForm] = useState({
    country: "Bali, Indonesia",
    travelType: "Couple / Honeymoon",
    budget: "$2,000 – $3,000",
    days: 7,
    interests: "beaches, spa, sunset dinners",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Itinerary | null>(null);
  const generate = useServerFn(generateItinerary);

  async function run() {
    setLoading(true); setError(null);
    try {
      const r = await generate({ data: form });
      setResult(r);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  }

  return (
    <section id="ai-planner" className="relative py-28 px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3 inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> AI Trip Planner
          </p>
          <h2 className="text-4xl md:text-6xl font-display font-light leading-tight">
            Your perfect trip, <br />
            written in <span className="italic text-gradient-sunset">seconds.</span>
          </h2>
          <p className="mt-5 text-muted-foreground max-w-md">
            Tell us your dream — budget, vibe, group, days — and our AI crafts a real day-by-day plan with hotels, food, and hidden gems.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <Field label="Destination" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
            <Field label="Travel style" value={form.travelType} onChange={(v) => setForm({ ...form, travelType: v })} />
            <Field label="Budget" value={form.budget} onChange={(v) => setForm({ ...form, budget: v })} />
            <Field label="Days" type="number" value={String(form.days)} onChange={(v) => setForm({ ...form, days: Math.min(30, Math.max(1, Number(v) || 1)) })} />
            <div className="col-span-2">
              <Field label="Interests" value={form.interests} onChange={(v) => setForm({ ...form, interests: v })} />
            </div>
          </div>

          <button
            onClick={run} disabled={loading}
            className="mt-8 gradient-sunset text-white px-6 py-3.5 rounded-full font-medium shadow-sunset hover:scale-105 transition inline-flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {loading ? "Crafting your journey…" : "Generate my itinerary"}
          </button>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        </div>

        <div className="relative min-h-[400px]">
          <div className="absolute -inset-6 gradient-ocean opacity-20 blur-3xl rounded-[3rem]" />
          <div className="relative rounded-3xl bg-card border border-border shadow-card overflow-hidden">
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl gradient-sunset grid place-items-center text-white shadow-sunset">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <p className="mt-5 font-display text-xl">Your AI itinerary appears here</p>
                  <p className="mt-2 text-sm text-muted-foreground">Fill the form and hit Generate.</p>
                </motion.div>
              )}
              {loading && (
                <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center">
                  <Loader2 className="w-8 h-8 mx-auto text-accent animate-spin" />
                  <p className="mt-4 font-display text-xl">Charting your route…</p>
                  <p className="mt-2 text-sm text-muted-foreground">Hotels, food, hidden gems incoming.</p>
                </motion.div>
              )}
              {result && !loading && (
                <motion.div key="r" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="p-5 border-b border-border gradient-ocean text-white">
                    <div className="text-[10px] uppercase tracking-widest opacity-80">Nova AI · Custom Itinerary</div>
                    <div className="font-display text-2xl mt-1">{result.title}</div>
                    <div className="text-sm opacity-90 mt-1">{result.summary}</div>
                    <div className="mt-3 inline-flex items-center gap-2 glass px-3 py-1 rounded-full text-xs">
                      <Wallet className="w-3 h-3" /> {result.estimatedBudget}
                    </div>
                  </div>
                  <div className="p-5 space-y-3 max-h-[500px] overflow-y-auto">
                    {result.days.map((d, i) => (
                      <motion.div key={d.day} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="flex gap-4 p-3 rounded-xl hover:bg-muted/60 transition">
                        <div className="text-xs font-display text-accent w-12 shrink-0 pt-0.5">Day {d.day}</div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{d.title}</div>
                          <ul className="mt-1 text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
                            {d.activities.map((a, j) => <li key={j}>{a}</li>)}
                          </ul>
                          {d.tip && <div className="mt-1 text-xs text-accent">💡 {d.tip}</div>}
                        </div>
                      </motion.div>
                    ))}
                    <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t border-border">
                      <Box icon={<Hotel className="w-4 h-4"/>} title="Hotels" items={result.hotels} />
                      <Box icon={<Utensils className="w-4 h-4"/>} title="Food" items={result.food} />
                    </div>
                    <div className="rounded-xl bg-muted/50 p-4">
                      <div className="text-xs uppercase tracking-widest text-accent mb-2">Budget breakdown</div>
                      <div className="space-y-1 text-sm">
                        {result.budgetBreakdown.map((b, i) => (
                          <div key={i} className="flex justify-between">
                            <span className="text-muted-foreground">{b.category}</span>
                            <span className="font-medium">{b.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="rounded-2xl border border-border bg-card p-4 block cursor-text hover:border-accent/40 transition">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-transparent font-medium text-sm focus:outline-none" />
    </label>
  );
}

function Box({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-accent mb-2">{icon} {title}</div>
      <ul className="text-xs space-y-1">{items.map((x, i) => <li key={i} className="text-muted-foreground">• {x}</li>)}</ul>
    </div>
  );
}
