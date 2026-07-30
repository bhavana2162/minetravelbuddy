import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nova TravelVerse — Travel communities for every kind of traveler" },
      {
        name: "description",
        content:
          "Join travel communities for solo travelers, groups, girls, boys and couples. Real-time chat, share plans, find your travel tribe.",
      },
      { property: "og:title", content: "Nova TravelVerse — Travel Communities" },
      { property: "og:description", content: "Discord-style real-time chat communities for travelers." },
    ],
  }),
  component: Landing,
});

type Community = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  cover_url: string | null;
};

function Landing() {
  const { user } = useAuth();
  const { data: communities = [] } = useQuery({
    queryKey: ["communities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .order("created_at");
      if (error) throw error;
      return data as Community[];
    },
  });

  const { data: counts = {} } = useQuery({
    queryKey: ["community-counts"],
    queryFn: async () => {
      const { data } = await (supabase as unknown as {
        rpc: (fn: string) => Promise<{ data: { community_id: string; member_count: number }[] | null }>;
      }).rpc("community_member_counts");
      const map: Record<string, number> = {};
      (data ?? []).forEach((r) => {
        map[r.community_id] = Number(r.member_count);
      });
      return map;
    },
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "var(--gradient-glow)" }}
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Travel communities, reimagined
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-5xl sm:text-7xl font-bold tracking-tight"
          >
            Find your <span className="text-gradient">travel tribe</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Join real-time chat communities for solo travelers, groups, girls, boys, and couples.
            Share plans, swap stories, meet your next travel buddy.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <Link
              to={user ? "/profile" : "/auth"}
              className="px-6 py-3 rounded-full gradient-primary text-white font-semibold shadow-glow hover:scale-105 transition inline-flex items-center gap-2"
            >
              {user ? "Your profile" : "Get started — it's free"}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#communities" className="px-6 py-3 rounded-full glass hover:bg-white/10 transition">
              Browse communities
            </a>
          </motion.div>
        </div>
      </section>

      {/* Communities */}
      <section id="communities" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">Communities</h2>
            <p className="text-muted-foreground mt-2">Pick your vibe and jump into the chat.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {communities.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to="/c/$slug"
                params={{ slug: c.slug }}
                className="group block rounded-2xl overflow-hidden glass shadow-card hover:shadow-glow transition-all hover:-translate-y-1"
              >
                <div className="relative h-44 overflow-hidden">
                  {c.cover_url && (
                    <img
                      src={c.cover_url}
                      alt={c.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                    <span className="px-2 py-1 rounded-full glass-strong flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-primary" />
                      {counts[c.id] ?? 0} members
                    </span>
                    <span className="px-2 py-1 rounded-full glass-strong flex items-center gap-1.5">
                      <MessageCircle className="w-3 h-3 text-primary" />
                      Live chat
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition">
                    {c.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
