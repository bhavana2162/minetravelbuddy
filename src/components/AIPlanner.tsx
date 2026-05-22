import { motion } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";

const fields = [
  { label: "Destination", value: "Bali, Indonesia" },
  { label: "Travel style", value: "Couple / Honeymoon" },
  { label: "Budget", value: "$2,000 — $3,000" },
  { label: "Duration", value: "7 days / 6 nights" },
];

const itinerary = [
  { day: "Day 1", title: "Arrival in Denpasar", note: "Private transfer + welcome dinner at Ubud" },
  { day: "Day 2", title: "Rice Terraces & Temples", note: "Tegallalang, Tirta Empul, sunset at Lempuyang" },
  { day: "Day 3", title: "Nusa Penida Island", note: "Kelingking, Angel's Billabong, snorkel with manta" },
  { day: "Day 4", title: "Spa & Slow Day", note: "Couples' flower bath + private villa pool" },
];

export function AIPlanner() {
  return (
    <section id="ai-planner" className="relative py-28 px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3 inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> AI Trip Planner
          </p>
          <h2 className="text-4xl md:text-6xl font-display font-light leading-tight">
            Your perfect trip, <br />
            written in <span className="italic text-gradient-sunset">seconds.</span>
          </h2>
          <p className="mt-5 text-muted-foreground max-w-md">
            Tell us your dream — budget, vibe, group, days — and our AI crafts a day-by-day plan with hotels,
            food, and hidden gems. Edit anything. Book in one tap.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.label} className="rounded-2xl border border-border bg-card p-4">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{f.label}</div>
                <div className="mt-1 font-medium text-sm">{f.value}</div>
              </div>
            ))}
          </div>

          <button className="mt-8 gradient-sunset text-white px-6 py-3.5 rounded-full font-medium shadow-sunset hover:scale-105 transition inline-flex items-center gap-2">
            <Wand2 className="w-4 h-4" /> Generate my itinerary
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -inset-6 gradient-ocean opacity-20 blur-3xl rounded-[3rem]" />
          <div className="relative rounded-3xl bg-card border border-border shadow-card overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full gradient-sunset grid place-items-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium">Nova AI · Bali Honeymoon</div>
                  <div className="text-xs text-muted-foreground">7 days · $2,840 estimate</div>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-accent/15 text-accent">Live</span>
            </div>
            <div className="p-5 space-y-3">
              {itinerary.map((d, i) => (
                <motion.div
                  key={d.day}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex gap-4 p-3 rounded-xl hover:bg-muted transition"
                >
                  <div className="text-xs font-display text-accent w-12 shrink-0 pt-0.5">{d.day}</div>
                  <div>
                    <div className="font-medium text-sm">{d.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{d.note}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
