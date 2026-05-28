import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Destinations } from "@/components/Destinations";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nova TravelVerse — Cinematic destination explorer" },
      {
        name: "description",
        content:
          "A minimal, premium destination showcase: Bali, Maldives, Goa, Thailand & South Korea — with local guides and curated experiences.",
      },
      { property: "og:title", content: "Nova TravelVerse — Cinematic destination explorer" },
      { property: "og:description", content: "Five hand-picked destinations. Local guides. Cinematic visuals." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <Destinations />
      <Footer />
    </main>
  );
}
