import { motion } from "framer-motion";
import { Star, Clock, ArrowUpRight, Heart, SlidersHorizontal } from "lucide-react";
import { destinations, countries } from "@/lib/travel-data";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useFavorites } from "@/hooks/useFavorites";

type Sort = "popular" | "rating" | "duration";

export function Destinations() {
  const [active, setActive] = useState<string>("All");
  const [sort, setSort] = useState<Sort>("popular");
  const [onlyFav, setOnlyFav] = useState(false);
  const { favs, toggle, isFav } = useFavorites();

  const list = useMemo(() => {
    let l = destinations.filter((d) => active === "All" || d.country === active || d.name.includes(active));
    if (onlyFav) l = l.filter((d) => favs.includes(d.id));
    if (sort === "rating") l = [...l].sort((a, b) => b.rating - a.rating);
    if (sort === "duration") l = [...l].sort((a, b) => a.days.localeCompare(b.days));
    return l;
  }, [active, sort, onlyFav, favs]);

  return (
    <section id="destinations" className="relative py-28 px-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Destinations</p>
        <h2 className="text-4xl md:text-6xl font-display font-light max-w-3xl">
          Hand-picked corners of <span className="italic text-gradient-sunset">the planet.</span>
        </h2>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-4 -mx-6 px-6">
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

      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <div className="text-sm text-muted-foreground">{list.length} trips</div>
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setOnlyFav((v) => !v)}
            className={`px-3 py-1.5 rounded-full border transition flex items-center gap-1.5 ${
              onlyFav ? "bg-accent/15 text-accent border-accent/40" : "border-border hover:border-accent/40"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFav ? "fill-accent" : ""}`} /> Saved
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border">
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="bg-transparent focus:outline-none text-sm cursor-pointer">
              <option value="popular">Popular</option>
              <option value="rating">Top rated</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((d, i) => (
          <motion.article
            key={d.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            className="group relative overflow-hidden rounded-3xl bg-card shadow-card hover:shadow-glow transition"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={d.image} alt={d.name} loading="lazy" width={1024} height={1280}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s] ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <span className="glass px-3 py-1 rounded-full text-xs text-white">{d.tag}</span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.preventDefault(); toggle(d.id); }}
                    className="glass w-8 h-8 rounded-full grid place-items-center text-white hover:scale-110 transition"
                    aria-label="Save"
                  >
                    <Heart className={`w-4 h-4 ${isFav(d.id) ? "fill-accent text-accent" : ""}`} />
                  </button>
                  <span className="glass px-2.5 py-1 rounded-full text-xs text-white flex items-center gap-1">
                    <Star className="w-3 h-3 fill-accent text-accent" /> {d.rating}
                  </span>
                </div>
              </div>

              <Link to="/destinations/$id" params={{ id: d.id }} className="absolute bottom-0 left-0 right-0 p-5 text-white block">
                <div className="text-xs text-white/70 uppercase tracking-widest mb-1">{d.country}</div>
                <div className="flex items-end justify-between gap-2">
                  <h3 className="text-2xl font-display">{d.name}</h3>
                  <span className="w-10 h-10 rounded-full bg-white text-foreground grid place-items-center group-hover:gradient-sunset group-hover:text-white transition">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-white/80">
                    <Clock className="w-3.5 h-3.5" /> {d.days}
                  </span>
                  <span className="font-display text-lg">{d.price}</span>
                </div>
              </Link>
            </div>
          </motion.article>
        ))}
        {list.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            No trips match. Try a different filter.
          </div>
        )}
      </div>
    </section>
  );
}
