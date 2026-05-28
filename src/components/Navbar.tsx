import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1100px,calc(100%-2rem))]"
    >
      <div className="glass-dark rounded-full px-5 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-white font-display text-xl">
          <span className="w-8 h-8 rounded-full gradient-sunset grid place-items-center shadow-sunset">
            <Globe2 className="w-4 h-4 text-white" />
          </span>
          Nova<span className="text-gradient-sunset">TravelVerse</span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-white/80">
          <a href="/#destinations" className="hover:text-white transition">Destinations</a>
        </nav>
        <a
          href="/#destinations"
          className="px-4 py-2 rounded-full gradient-sunset text-white text-sm font-medium shadow-sunset hover:scale-105 transition"
        >
          Explore
        </a>
      </div>
    </motion.header>
  );
}
