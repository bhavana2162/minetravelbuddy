import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TravelStyles } from "@/components/TravelStyles";
import { Destinations } from "@/components/Destinations";
import { CountryExplorer } from "@/components/CountryExplorer";
import { Events } from "@/components/Events";
import { AIPlanner } from "@/components/AIPlanner";
import { Community } from "@/components/Community";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nova TravelVerse — Explore the world beyond borders" },
      {
        name: "description",
        content:
          "Futuristic AI-powered travel platform. Solo, couple, group, girls-only & guided trips across 120+ countries with festivals, itineraries & local pricing.",
      },
      { property: "og:title", content: "Nova TravelVerse — Explore the world beyond borders" },
      { property: "og:description", content: "AI-powered global travel ecosystem with curated trips & festivals." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <TravelStyles />
      <Destinations />
      <CountryExplorer />
      <Events />
      <AIPlanner />
      <Community />
      <Footer />
    </main>
  );
}
