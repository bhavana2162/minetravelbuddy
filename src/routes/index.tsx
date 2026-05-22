import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TravelStyles } from "@/components/TravelStyles";
import { Destinations } from "@/components/Destinations";
import { Events } from "@/components/Events";
import { AIPlanner } from "@/components/AIPlanner";
import { Community } from "@/components/Community";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nova Travels — Explore the world without limits" },
      {
        name: "description",
        content:
          "AI-powered tourism platform. Solo, couple, group, girls-only & guided trips across 120+ countries with festivals, itineraries & local pricing.",
      },
      { property: "og:title", content: "Nova Travels — Explore the world without limits" },
      { property: "og:description", content: "AI-powered global travel platform with curated trips & festivals." },
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
      <Events />
      <AIPlanner />
      <Community />
      <Footer />
    </main>
  );
}
