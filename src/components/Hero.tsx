import { motion } from "framer-motion";
import { Search, MapPin, Sparkles, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-island.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <img
        src={heroImg}
        alt="Tropical island lagoon at sunset"
        width={1920}
        height={1280}
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />

      <div className="relative z-10 pt-40 pb-24 px-6 max-w-6xl mx-auto text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 glass-dark px-4 py-1.5 rounded-full text-xs tracking-widest uppercase mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          AI-powered travel for every soul
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-[5.5rem] leading-[1.05] font-display font-light"
        >
          Explore the world <br />
          <span className="italic text-gradient-sunset">without limits.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
        >
          Solo trips, couple escapes, group adventures, festivals, and guided experiences across every country.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 glass-dark rounded-2xl p-2 flex items-center max-w-2xl mx-auto shadow-glow"
        >
          <div className="flex-1 flex items-center gap-3 px-4">
            <Search className="w-5 h-5 text-white/60" />
            <input
              placeholder="Search Bali, Holi festival, solo trips…"
              className="flex-1 bg-transparent py-3 text-white placeholder:text-white/50 focus:outline-none text-sm"
            />
          </div>
          <button className="gradient-sunset rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-2 hover:scale-[1.02] transition shadow-sunset">
            Discover <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <a href="#destinations" className="glass-dark px-5 py-2.5 rounded-full text-sm flex items-center gap-2 hover:bg-white/15 transition">
            <MapPin className="w-4 h-4" /> Explore Destinations
          </a>
          <a href="#ai-planner" className="bg-white text-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:scale-105 transition flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Plan My Trip with AI
          </a>
        </motion.div>

        <div className="mt-20 grid grid-cols-3 max-w-xl mx-auto gap-8 text-left">
          {[
            { k: "120+", v: "Countries" },
            { k: "2,400", v: "Curated trips" },
            { k: "98%", v: "5-star reviews" },
          ].map((s, i) => (
            <motion.div
              key={s.v}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="border-l border-white/20 pl-4"
            >
              <div className="text-3xl font-display">{s.k}</div>
              <div className="text-xs uppercase tracking-widest text-white/60 mt-1">{s.v}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
