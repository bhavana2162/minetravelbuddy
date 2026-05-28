import { Globe2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border">
      <div className="max-w-5xl mx-auto px-6 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-display text-2xl">
            <span className="w-8 h-8 rounded-full gradient-sunset grid place-items-center">
              <Globe2 className="w-4 h-4 text-white" />
            </span>
            Nova<span className="text-gradient-sunset">TravelVerse</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            A cinematic destination explorer. Five places. Local guides. Real experiences.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Nova TravelVerse · Made for wanderers.
        </div>
      </div>
    </footer>
  );
}
