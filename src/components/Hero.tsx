import { motion } from "framer-motion";
import { MapPin, Sparkles, ArrowRight } from "lucide-react";
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
          Explore The World <br />
          <span className="italic text-gradient-sunset">Beyond Borders.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
        >
          Five cinematic destinations. Local guides. Real experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex justify-center"
        >
          <a
            href="#destinations"
            className="bg-white text-foreground px-6 py-3 rounded-full text-sm font-medium hover:scale-105 transition flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" /> Explore Destinations <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
