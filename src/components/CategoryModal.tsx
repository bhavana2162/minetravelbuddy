import { AnimatePresence, motion } from "framer-motion";
import { X, MapPin, Calendar, Users, Wallet, Sparkles, Star, Shield, Sun, CheckCircle2, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { categoryData } from "@/lib/category-data";
import { countries } from "@/lib/travel-data";

type Props = { category: string | null; onClose: () => void };

const BUDGETS = ["Budget", "Mid-range", "Premium", "Luxury"];
const DAYS = [3, 4, 5, 7, 10, 14];

export function CategoryModal({ category, onClose }: Props) {
  const data = category ? categoryData[category] : null;
  const [country, setCountry] = useState(countries[0].name);
  const [city, setCity] = useState(countries[0].cities[0]);
  const [date, setDate] = useState("");
  const [days, setDays] = useState(4);
  const [budget, setBudget] = useState("Mid-range");
  const [travelers, setTravelers] = useState(2);
  const [showEstimate, setShowEstimate] = useState(false);

  useEffect(() => {
    const c = countries.find((x) => x.name === country);
    if (c) setCity(c.cities[0]);
  }, [country]);

  useEffect(() => {
    if (category) {
      setShowEstimate(false);
      document.body.style.overflow = "hidden";
    } else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [category]);

  const estimate = useMemo(() => {
    const base = budget === "Budget" ? 3500 : budget === "Mid-range" ? 7500 : budget === "Premium" ? 15000 : 28000;
    const total = base * days * travelers;
    return `₹${total.toLocaleString("en-IN")}`;
  }, [budget, days, travelers]);

  return (
    <AnimatePresence>
      {category && data && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl mx-auto my-8 rounded-3xl bg-background border border-border shadow-2xl overflow-hidden"
          >
            <div className="relative h-44 md:h-56 gradient-sunset overflow-hidden">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${data.tops[0].image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full glass grid place-items-center text-white hover:scale-110 transition z-10">
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <div className="text-[11px] uppercase tracking-[0.3em] text-white/80 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Curated experience
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-light">{category}</h2>
                <p className="text-white/85 text-sm md:text-base mt-1">{data.tagline}</p>
              </div>
            </div>

            <div className="p-6 md:p-8 grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-5">
                <div>
                  <div className="text-xs uppercase tracking-widest text-accent mb-3">Plan your trip</div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Country" icon={MapPin}>
                      <select value={country} onChange={(e) => setCountry(e.target.value)} className="bg-transparent w-full focus:outline-none text-sm">
                        {countries.map((c) => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
                      </select>
                    </Field>
                    <Field label="Destination" icon={MapPin}>
                      <select value={city} onChange={(e) => setCity(e.target.value)} className="bg-transparent w-full focus:outline-none text-sm">
                        {(countries.find((c) => c.name === country)?.cities ?? []).map((x) => <option key={x}>{x}</option>)}
                      </select>
                    </Field>
                    <Field label="Travel date" icon={Calendar}>
                      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent w-full focus:outline-none text-sm" />
                    </Field>
                    <Field label="Days" icon={Calendar}>
                      <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="bg-transparent w-full focus:outline-none text-sm">
                        {DAYS.map((d) => <option key={d} value={d}>{d} days</option>)}
                      </select>
                    </Field>
                    <Field label="Budget range" icon={Wallet}>
                      <select value={budget} onChange={(e) => setBudget(e.target.value)} className="bg-transparent w-full focus:outline-none text-sm">
                        {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                      </select>
                    </Field>
                    <Field label="Travelers" icon={Users}>
                      <input type="number" min={1} max={30} value={travelers} onChange={(e) => setTravelers(Math.max(1, Number(e.target.value)))} className="bg-transparent w-full focus:outline-none text-sm" />
                    </Field>
                  </div>
                  <button
                    onClick={() => setShowEstimate(true)}
                    className="mt-4 w-full gradient-sunset text-white py-3 rounded-full font-medium shadow-sunset hover:scale-[1.01] transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Get instant estimate
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {showEstimate ? (
                    <motion.div
                      key="est"
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="rounded-3xl border border-accent/30 bg-card p-5 shadow-glow"
                    >
                      <div className="text-xs uppercase tracking-widest text-accent">Estimate</div>
                      <div className="font-display text-4xl mt-1">{estimate}</div>
                      <div className="text-xs text-muted-foreground">{city}, {country} · {days}D · {travelers} traveler{travelers > 1 ? "s" : ""}</div>
                      <div className="mt-4 space-y-2 text-sm">
                        <Row icon={Shield} k="Safety score" v={`${data.tops[0].safety} / 5`} />
                        <Row icon={Sun} k="Best season" v={data.tops[0].season} />
                        <Row icon={Calendar} k="Weather" v="22–28°C, clear skies" />
                      </div>
                      <div className="mt-4 rounded-xl border border-border p-3">
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Included</div>
                        <ul className="space-y-1.5 text-sm">
                          {data.perks.map((p) => (
                            <li key={p} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-accent" /> {p}</li>
                          ))}
                        </ul>
                      </div>
                      <button className="mt-4 w-full bg-foreground text-background py-2.5 rounded-full text-sm font-medium hover:opacity-90">
                        Reserve now
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ph"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground h-full grid place-items-center"
                    >
                      <div>
                        <Sparkles className="w-6 h-6 text-accent mx-auto mb-2" />
                        Fill the form and get instant pricing, hotels, transport & activities tailored for {category}.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="px-6 md:px-8 pb-10">
              <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">Top 10 for {category}</p>
                  <h3 className="text-2xl md:text-3xl font-display font-light">Hand-picked destinations</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.tops.map((d, i) => (
                  <motion.article
                    key={d.name + i}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                    className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-accent/40 hover:shadow-glow transition"
                  >
                    <div className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full bg-foreground text-background grid place-items-center text-xs font-display">{i + 1}</div>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={d.image} alt={d.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s] ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                      <div className="absolute bottom-2 right-2 glass text-white text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-accent text-accent" /> {d.rating}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-display text-lg leading-tight">{d.name}</div>
                          <div className="text-[11px] text-muted-foreground uppercase tracking-widest">{d.country}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-base">{d.budget}</div>
                          <div className="text-[10px] text-muted-foreground">est.</div>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                        <Pill icon={Sun} text={d.season} />
                        <Pill icon={Shield} text={`Safe ${d.safety}`} />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {d.tags.map((t) => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{t}</span>
                        ))}
                      </div>
                      <button className="mt-3 w-full text-sm flex items-center justify-center gap-1 py-2 rounded-full border border-border hover:border-accent/40 hover:text-accent transition">
                        Explore <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <label className="block rounded-2xl border border-border bg-card px-4 py-2.5 focus-within:border-accent/50 transition">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Icon className="w-3 h-3" /> {label}</div>
      <div className="mt-0.5">{children}</div>
    </label>
  );
}

function Row({ icon: Icon, k, v }: { icon: React.ElementType; k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" /> {k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}

function Pill({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-muted-foreground">
      <Icon className="w-3 h-3" /> {text}
    </span>
  );
}
