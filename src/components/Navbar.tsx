import { motion } from "framer-motion";
import { Globe2, Search } from "lucide-react";

const links = ["Destinations", "Countries", "Styles", "Events", "AI Planner", "Community"];

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1200px,calc(100%-2rem))]"
    >
      <div className="glass-dark rounded-full px-5 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-white font-display text-xl">
          <span className="w-8 h-8 rounded-full gradient-sunset grid place-items-center shadow-sunset">
            <Globe2 className="w-4 h-4 text-white" />
          </span>
          Nova<span className="text-gradient-sunset">TravelVerse</span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-white/80">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} className="hover:text-white transition">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden sm:grid place-items-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition">
            <Search className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 rounded-full gradient-sunset text-white text-sm font-medium shadow-sunset hover:scale-105 transition">
            Sign In
          </button>
        </div>
      </div>
    </motion.header>
  );
}
