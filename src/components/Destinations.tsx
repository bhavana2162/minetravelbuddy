import { motion } from "framer-motion";
import { Star, Clock, ArrowUpRight } from "lucide-react";
import { destinations, countries } from "@/lib/travel-data";
import { useState } from "react";

export function Destinations() {
  const [active, setActive] = useState<string>("All");

  return (
    <section id="destinations" className="relative py-28 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Destinations</p>
        <h2 className="text-4xl md:text-6xl font-display font-light max-w-3xl">
          Hand-picked corners of <span className="italic text-gradient-sunset">the planet.</span>
        </h2>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-8 -mx-6 px-6">
        {["All", ...countries.map((c) => c.name)].map((name) => (
          <button
            key={name}
            onClick={() => setActive(name)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm border transition ${
              active === name
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
            }`}
          >
            {name === "All" ? "🌍 All" : `${countries.find((c) => c.name === name)?.flag} ${name}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations
          .filter((d) => active === "All" || d.country === active || d.name.includes(active))
          .map((d, i) => (
            <motion.article
              key={d.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="group relative overflow-hidden rounded-3xl bg-card shadow-card hover:shadow-glow transition"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <span className="glass px-3 py-1 rounded-full text-xs text-white">{d.tag}</span>
                  <span className="glass px-2.5 py-1 rounded-full text-xs text-white flex items-center gap-1">
                    <Star className="w-3 h-3 fill-accent text-accent" /> {d.rating}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="text-xs text-white/70 uppercase tracking-widest mb-1">{d.country}</div>
                  <div className="flex items-end justify-between gap-2">
                    <h3 className="text-2xl font-display">{d.name}</h3>
                    <button className="w-10 h-10 rounded-full bg-white text-foreground grid place-items-center group-hover:gradient-sunset group-hover:text-white transition">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-white/80">
                      <Clock className="w-3.5 h-3.5" /> {d.days}
                    </span>
                    <span className="font-display text-lg">{d.price}</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
      </div>
    </section>
  );
}
