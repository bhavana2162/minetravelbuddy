import { motion } from "framer-motion";
import { events } from "@/lib/travel-data";

export function Events() {
  return (
    <section id="events" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,oklch(0.82_0.16_70/0.3),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6 text-white">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Events Around The World</p>
            <h2 className="text-4xl md:text-6xl font-display font-light max-w-2xl">
              Travel for the <span className="italic text-gradient-sunset">celebration.</span>
            </h2>
          </div>
          <p className="text-white/70 max-w-sm">
            12 months. 120 festivals. Build your year around the world's most unforgettable moments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((e, i) => (
            <motion.div
              key={e.name + e.country}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: (i % 6) * 0.05 }}
              className="glass-dark rounded-2xl p-6 hover:bg-white/10 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-accent">{e.month}</span>
                <span className="text-xs text-white/60">{e.weather}</span>
              </div>
              <div className="mt-4 text-sm text-white/70">{e.country}</div>
              <h3 className="font-display text-2xl mt-1">{e.name}</h3>
              <p className="text-sm text-white/70 mt-2">{e.desc}</p>
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-white/50">from</span>
                <span className="font-display text-xl">{e.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
