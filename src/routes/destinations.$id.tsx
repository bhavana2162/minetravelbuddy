import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { destinations } from "@/lib/travel-data";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Star, Clock, MapPin, Heart, Share2, Calendar, Users, Shield, Cloud, Utensils, Moon, CheckCircle2 } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

export const Route = createFileRoute("/destinations/$id")({
  loader: ({ params }) => {
    const d = destinations.find((x) => x.id === params.id);
    if (!d) throw notFound();
    return d;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Destination"} — Nova TravelVerse` },
      { name: "description", content: `Explore ${loaderData?.name}: itinerary, hotels, food, nightlife & budget.` },
      { property: "og:image", content: loaderData?.image },
    ],
  }),
  component: DestinationPage,
  notFoundComponent: () => <div className="p-20 text-center">Destination not found.</div>,
});

const TABS = ["Overview", "Itinerary", "Food", "Nightlife", "Reviews"] as const;

function DestinationPage() {
  const d = Route.useLoaderData();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const { isFav, toggle } = useFavorites();

  return (
    <main className="bg-background text-foreground">
      <Navbar />

      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <img src={d.image} alt={d.name} className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-16 text-white h-full flex flex-col justify-end">
          <Link to="/" className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-white/70 hover:text-white mb-4">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
          <div className="text-xs uppercase tracking-[0.3em] text-accent mb-2 flex items-center gap-1.5">
            <MapPin className="w-3 h-3" /> {d.country}
          </div>
          <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl md:text-7xl font-display font-light">
            {d.name}
          </motion.h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
            <span className="glass px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" /> {d.rating} · 1.2k reviews
            </span>
            <span className="glass px-3 py-1.5 rounded-full flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {d.days}</span>
            <span className="glass px-3 py-1.5 rounded-full">{d.tag}</span>
            <span className="ml-auto font-display text-3xl">{d.price}</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 -mt-6 relative z-20">
        <div className="rounded-3xl bg-card border border-border shadow-card p-5 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex gap-2">
            <button onClick={() => toggle(d.id)} className="px-4 py-2.5 rounded-full border border-border hover:border-accent/40 flex items-center gap-2 text-sm">
              <Heart className={`w-4 h-4 ${isFav(d.id) ? "fill-accent text-accent" : ""}`} /> {isFav(d.id) ? "Saved" : "Save"}
            </button>
            <button className="px-4 py-2.5 rounded-full border border-border hover:border-accent/40 flex items-center gap-2 text-sm">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
          <button className="gradient-sunset text-white px-6 py-3 rounded-full text-sm font-medium shadow-sunset hover:scale-105 transition">
            Book this trip
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex gap-2 border-b border-border mb-6 overflow-x-auto">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 -mb-px transition ${
                tab === t ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>{t}</button>
            ))}
          </div>

          {tab === "Overview" && (
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                {d.name} is one of {d.country}'s most beloved escapes — a place that blends iconic landmarks with local soul. This curated trip mixes signature experiences with hidden moments only locals know.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { i: Cloud, k: "Weather", v: "Pleasant, 22–28°C" },
                  { i: Shield, k: "Safety", v: "Very Safe · 4.8/5" },
                  { i: Users, k: "Group Size", v: "Up to 12 travelers" },
                  { i: Calendar, k: "Best Time", v: "Oct – Mar" },
                ].map((x) => (
                  <div key={x.k} className="rounded-2xl border border-border p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-ocean grid place-items-center text-white"><x.i className="w-4 h-4" /></div>
                    <div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">{x.k}</div><div className="text-sm font-medium">{x.v}</div></div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-border p-5">
                <div className="text-xs uppercase tracking-widest text-accent mb-3">What's included</div>
                <ul className="space-y-2 text-sm">
                  {["4-star boutique stay", "Daily breakfast", "Airport transfers", "Local guide", "Curated experiences", "24/7 concierge"].map((x) => (
                    <li key={x} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> {x}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === "Itinerary" && (
            <div className="space-y-3">
              {[
                { day: 1, t: "Arrival & welcome dinner", a: "Private transfer, hotel check-in, sunset rooftop dinner" },
                { day: 2, t: "Iconic sights tour", a: "Top landmarks, expert local guide, traditional lunch" },
                { day: 3, t: "Adventure day", a: "Outdoor activity, scenic photo stops, free evening" },
                { day: 4, t: "Local immersion", a: "Hidden neighborhoods, street food crawl, live music" },
              ].map((x, i) => (
                <motion.div key={x.day} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="flex gap-4 p-4 rounded-xl border border-border hover:border-accent/40 transition">
                  <div className="text-xs font-display text-accent w-12 shrink-0 pt-0.5">Day {x.day}</div>
                  <div><div className="font-medium text-sm">{x.t}</div><div className="text-xs text-muted-foreground mt-1">{x.a}</div></div>
                </motion.div>
              ))}
            </div>
          )}

          {tab === "Food" && (
            <div className="grid sm:grid-cols-2 gap-3">
              {["Signature local dish", "Street market crawl", "Chef's-table dinner", "Sunset cocktails"].map((f) => (
                <div key={f} className="rounded-2xl border border-border p-4 flex items-center gap-3">
                  <Utensils className="w-4 h-4 text-accent" /> {f}
                </div>
              ))}
            </div>
          )}

          {tab === "Nightlife" && (
            <div className="rounded-2xl border border-border p-5 flex items-start gap-3">
              <Moon className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Nights that never end</div>
                <p className="text-sm text-muted-foreground mt-1">Rooftop bars, beach clubs, hidden speakeasies and live music venues curated by locals.</p>
              </div>
            </div>
          )}

          {tab === "Reviews" && (
            <div className="space-y-3">
              {[
                { n: "Aisha · Solo", t: "Absolutely magical. Every day felt cinematic.", r: 5 },
                { n: "Marco & Lia · Couple", t: "The honeymoon we'd been dreaming of.", r: 5 },
                { n: "Backpack Crew", t: "Loved the local guide. Hidden gems for days.", r: 4.8 },
              ].map((r) => (
                <div key={r.n} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between"><div className="text-sm font-medium">{r.n}</div>
                    <div className="flex items-center gap-1 text-xs"><Star className="w-3 h-3 fill-accent text-accent" />{r.r}</div></div>
                  <p className="text-sm text-muted-foreground mt-1">{r.t}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 self-start space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">From</div>
            <div className="flex items-end justify-between mt-1">
              <div className="font-display text-4xl">{d.price}</div>
              <div className="text-xs text-muted-foreground">{d.days}</div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <Row k="Duration" v={d.days} />
              <Row k="Group size" v="2–12" />
              <Row k="Guide" v="Included" />
              <Row k="Flights" v="On request" />
            </div>
            <button className="mt-5 w-full gradient-sunset text-white py-3 rounded-full font-medium shadow-sunset hover:scale-[1.02] transition">
              Book now
            </button>
            <p className="mt-3 text-[11px] text-muted-foreground text-center">Free cancellation up to 14 days before</p>
          </div>
        </aside>
      </section>

      <Footer />
      <ChatBot />
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}
