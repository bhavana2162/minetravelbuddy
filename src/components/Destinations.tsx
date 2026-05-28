import { motion } from "framer-motion";
import { ArrowUpRight, Star, Clock, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { destinations } from "@/lib/travel-data";

export function Destinations() {
  return (
    <section id="destinations" className="relative py-28 px-6 max-w-7xl mx-auto">
      <div className="mb-14 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Five places. One feeling.</p>
        <h2 className="text-4xl md:text-6xl font-display font-light leading-[1.05]">
          Cinematic destinations, <span className="italic text-gradient-sunset">curated by locals.</span>
        </h2>
      </div>

      <div className="space-y-10">
        {destinations.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/destinations/$id"
              params={{ id: d.id }}
              className="group block relative overflow-hidden rounded-[2rem] shadow-card hover:shadow-glow transition"
            >
              <div className={`relative aspect-[16/9] md:aspect-[21/9] overflow-hidden`}>
                <img
                  src={d.image}
                  alt={d.name}
                  loading={i === 0 ? "eager" : "lazy"}
                  width={1600}
                  height={900}
                  className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[1.6s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

                <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-white">
                  <span className="glass px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> {d.country}
                  </span>
                  <span className="glass px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-accent text-accent" /> {d.rating}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 text-white flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <div className="max-w-xl">
                    <div className="text-xs uppercase tracking-[0.3em] text-white/70 mb-2">{d.tagline}</div>
                    <h3 className="text-4xl md:text-6xl font-display font-light leading-[1.05]">{d.name}</h3>
                    <p className="mt-3 text-white/80 text-sm md:text-base max-w-md">{d.blurb}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/70">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {d.days}</span>
                      <span>·</span>
                      <span>Best: {d.bestSeason}</span>
                      <span>·</span>
                      <span>{d.weather}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="glass px-5 py-3 rounded-full text-sm flex items-center gap-2 group-hover:bg-white group-hover:text-foreground transition">
                      Explore guide <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
