import { motion } from "framer-motion";
import { useState } from "react";
import { styles } from "@/lib/travel-data";
import { CategoryModal } from "./CategoryModal";

export function TravelStyles() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="styles" className="relative py-28 px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Travel Styles</p>
          <h2 className="text-4xl md:text-6xl font-display font-light max-w-2xl">
            Every way to <span className="italic text-gradient-ocean">wander.</span>
          </h2>
        </div>
        <p className="text-muted-foreground max-w-sm">
          From solo soul-searches to girls-only road trips — tap a vibe to book instantly.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {styles.map((s, i) => (
          <motion.button
            key={s.name}
            onClick={() => setActive(s.name)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: (i % 8) * 0.04 }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-2xl bg-card border border-border p-5 text-left shadow-card hover:shadow-glow hover:border-accent/40 transition cursor-pointer"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full gradient-sunset opacity-0 group-hover:opacity-20 blur-2xl transition-opacity" />
            <div className="text-3xl mb-3">{s.icon}</div>
            <div className="font-display text-lg">{s.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
            <div className="mt-3 text-[10px] uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 transition">
              Tap to explore →
            </div>
          </motion.button>
        ))}
      </div>

      <CategoryModal category={active} onClose={() => setActive(null)} />
    </section>
  );
}
