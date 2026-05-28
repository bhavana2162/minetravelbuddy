import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { destinations } from "@/lib/travel-data";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Star, Clock, MapPin, Calendar, Users, Shield, Cloud,
  Sparkles, Compass, MessageCircle, UserCheck, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/destinations/$id")({
  loader: ({ params }) => {
    const d = destinations.find((x) => x.id === params.id);
    if (!d) throw notFound();
    return d;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Destination"} — Nova TravelVerse` },
      { name: "description", content: `Explore ${loaderData?.name}: local guides, experiences, best season & estimated budget.` },
      { property: "og:image", content: loaderData?.image },
    ],
  }),
  component: DestinationPage,
  notFoundComponent: () => <div className="p-20 text-center">Destination not found.</div>,
});

type TripType = "Group" | "Girls" | "Boys";

function DestinationPage() {
  const d = Route.useLoaderData();

  const [type, setType] = useState<TripType>("Group");
  const [date, setDate] = useState<string>("");
  const [days, setDays] = useState<number>(5);
  const [travelers, setTravelers] = useState<number>(4);

  const estimate = useMemo(() => {
    const total = d.budgetPerDay * days * travelers;
    return `$${total.toLocaleString("en-US")}`;
  }, [d.budgetPerDay, days, travelers]);

  return (
    <main className="bg-background text-foreground">
      <Navbar />

      <section className="relative h-[72vh] min-h-[520px] w-full overflow-hidden">
        <img src={d.image} alt={d.name} className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-16 h-full flex flex-col justify-end text-white">
          <Link to="/" className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-white/70 hover:text-white mb-4">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
          <div className="text-xs uppercase tracking-[0.3em] text-accent mb-2 flex items-center gap-1.5">
            <MapPin className="w-3 h-3" /> {d.country}
          </div>
          <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl md:text-7xl font-display font-light">
            {d.name}
          </motion.h1>
          <p className="mt-4 max-w-xl text-white/85 text-lg">{d.blurb}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="glass px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" /> {d.rating}
            </span>
            <span className="glass px-3 py-1.5 rounded-full flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {d.days}</span>
            <span className="glass px-3 py-1.5 rounded-full">{d.tagline}</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-5 gap-8">
        {/* Plan form */}
        <div className="lg:col-span-3 space-y-8">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-accent mb-5">
              <Sparkles className="w-3.5 h-3.5" /> Plan your trip
            </div>

            <Label>Select type</Label>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {(["Group", "Girls", "Boys"] as TripType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-3 rounded-2xl text-sm border transition ${
                    type === t
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-accent/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Destination">
                <div className="px-4 py-3 rounded-xl border border-border bg-background/40 text-sm">{d.name}, {d.country}</div>
              </Field>
              <Field label="Next travel date">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/40 text-sm focus:outline-none focus:border-accent/60"
                />
              </Field>
              <Field label="Number of days">
                <input
                  type="number" min={1} max={30} value={days}
                  onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/40 text-sm focus:outline-none focus:border-accent/60"
                />
              </Field>
              <Field label="Number of travelers">
                <input
                  type="number" min={1} max={50} value={travelers}
                  onChange={(e) => setTravelers(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/40 text-sm focus:outline-none focus:border-accent/60"
                />
              </Field>
            </div>
          </div>

          {/* Guide services */}
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-accent mb-5">
              <UserCheck className="w-3.5 h-3.5" /> Guide services
            </div>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm">
              {d.guides.map((g: string) => (
                <li key={g} className="flex items-center gap-2 p-3 rounded-xl border border-border">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" /> {g}
                </li>
              ))}
            </ul>
          </div>

          {/* Experiences */}
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-accent mb-5">
              <Compass className="w-3.5 h-3.5" /> Local experiences & sightseeing
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {d.experiences.map((x: string, i: number) => (
                <motion.div
                  key={x}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-2xl border border-border hover:border-accent/40 transition text-sm"
                >
                  {x}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Estimate sidebar */}
        <aside className="lg:col-span-2 lg:sticky lg:top-28 self-start space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Estimated trip budget</div>
            <div className="font-display text-5xl mt-2">{estimate}</div>
            <div className="text-xs text-muted-foreground mt-1">
              For {travelers} traveler{travelers > 1 ? "s" : ""} · {days} day{days > 1 ? "s" : ""} · {type}
            </div>
            <div className="text-[11px] text-muted-foreground mt-2">
              Covers local guides, experiences & transport guidance. Excludes flights & stays.
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <Stat icon={Shield} k="Safety score" v={d.safety} />
              <Stat icon={Calendar} k="Best season" v={d.bestSeason} />
              <Stat icon={Cloud} k="Weather" v={d.weather} />
              <Stat icon={Users} k="Trip type" v={type} />
            </div>

            <div className="mt-6 space-y-2">
              <button className="w-full gradient-sunset text-white py-3 rounded-full font-medium shadow-sunset hover:scale-[1.02] transition flex items-center justify-center gap-2">
                <Compass className="w-4 h-4" /> Explore Guide
              </button>
              <button className="w-full bg-foreground text-background py-3 rounded-full font-medium hover:opacity-90 transition flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" /> Connect With Guide
              </button>
              <button className="w-full border border-border py-3 rounded-full font-medium hover:border-accent/40 transition flex items-center justify-center gap-2">
                <UserCheck className="w-4 h-4" /> View Local Guide
              </button>
            </div>
          </div>
        </aside>
      </section>

      <Footer />
    </main>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Stat({ icon: Icon, k, v }: { icon: React.ComponentType<{ className?: string }>; k: string; v: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl border border-border">
      <div className="w-9 h-9 rounded-xl gradient-ocean grid place-items-center text-white shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
        <div className="text-sm font-medium truncate">{v}</div>
      </div>
    </div>
  );
}
