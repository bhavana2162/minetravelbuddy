import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Shield, Wallet, CalendarDays, Thermometer, Moon, Utensils, MapPin, Sparkles } from "lucide-react";
import { countryDetails } from "@/lib/country-details";

export function CountryExplorer() {
  const [activeCode, setActiveCode] = useState(countryDetails[0].code);
  const country = countryDetails.find((c) => c.code === activeCode)!;

  return (
    <section id="countries" className="relative py-28 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Country Explorer</p>
        <h2 className="text-4xl md:text-6xl font-display font-light max-w-3xl">
          Pick a country, <span className="italic text-gradient-ocean">live its story.</span>
        </h2>
        <p className="mt-4 text-muted-foreground max-w-lg">
          Cities, weather, safety, food, nightlife & local experiences — everything you need to choose your next chapter.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-8 -mx-6 px-6">
        {countryDetails.map((c) => (
          <button
            key={c.code}
            onClick={() => setActiveCode(c.code)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm border transition ${
              activeCode === c.code
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
            }`}
          >
            {c.flag} {c.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={country.code}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-5 gap-6"
        >
          <div className="lg:col-span-2 relative rounded-3xl overflow-hidden min-h-[420px] shadow-card">
            <img src={country.image} alt={country.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute top-5 left-5 right-5 flex justify-between">
              <span className="glass px-3 py-1 rounded-full text-xs text-white">{country.flag} {country.name}</span>
              <span className="glass px-3 py-1 rounded-full text-xs text-white flex items-center gap-1">
                <Shield className="w-3 h-3 text-accent" /> {country.safety}/5 safe
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="text-xs uppercase tracking-widest text-white/70 mb-2">{country.tagline}</div>
              <h3 className="font-display text-4xl md:text-5xl">{country.name}</h3>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <Stat icon={<Wallet className="w-4 h-4" />} label="Est. Budget" value={country.budget} />
                <Stat icon={<CalendarDays className="w-4 h-4" />} label="Best Season" value={country.bestSeason} />
                <Stat icon={<Thermometer className="w-4 h-4" />} label="Weather" value={country.weather} />
                <Stat icon={<Sparkles className="w-4 h-4" />} label="Currency" value={country.currency} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
            <InfoCard icon={<MapPin className="w-4 h-4" />} title="Famous Cities" items={country.cities} />
            <InfoCard icon={<Sparkles className="w-4 h-4" />} title="Top Attractions" items={country.attractions} />
            <InfoCard icon={<Utensils className="w-4 h-4" />} title="Local Food" items={country.food} />
            <InfoCard icon={<Sparkles className="w-4 h-4" />} title="Experiences" items={country.experiences} />
            <div className="sm:col-span-2 rounded-2xl border border-border bg-card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl gradient-sunset grid place-items-center text-white shrink-0">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Nightlife</div>
                <div className="mt-1 text-sm">{country.nightlife}</div>
              </div>
              <button className="ml-auto self-center gradient-sunset text-white text-sm px-4 py-2.5 rounded-full shadow-sunset hover:scale-105 transition whitespace-nowrap">
                View packages
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/70">
        {icon} {label}
      </div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function InfoCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 hover:shadow-glow transition">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent mb-3">
        {icon} {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-muted text-foreground/80 hover:bg-accent/15 hover:text-accent transition cursor-pointer">
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}
