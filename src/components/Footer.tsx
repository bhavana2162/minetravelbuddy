import { Globe2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-2xl">
            <span className="w-8 h-8 rounded-full gradient-sunset grid place-items-center">
              <Globe2 className="w-4 h-4 text-white" />
            </span>
            Nova<span className="text-gradient-sunset">TravelVerse</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            The futuristic travel ecosystem — AI itineraries, group tribes, and cinematic journeys across 120+ countries.
          </p>
        </div>
        {[
          { t: "Explore", l: ["Destinations", "Travel Styles", "Events", "AI Planner"] },
          { t: "Company", l: ["About", "Careers", "Press", "Contact"] },
        ].map((c) => (
          <div key={c.t}>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{c.t}</div>
            <ul className="space-y-2 text-sm">
              {c.l.map((x) => (
                <li key={x}>
                  <a href="#" className="hover:text-accent transition">{x}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Nova TravelVerse. Made for wanderers.
      </div>
    </footer>
  );
}
