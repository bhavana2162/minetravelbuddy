import { motion } from "framer-motion";
import { Users, Heart, MessageCircle } from "lucide-react";

const groups = [
  { name: "Girls Who Wander", members: "12.4k", tag: "Girls-Only", color: "from-pink-500 to-rose-500" },
  { name: "Backpack Brotherhood", members: "8.9k", tag: "Boys-Only", color: "from-blue-500 to-indigo-600" },
  { name: "Couples on the Move", members: "6.1k", tag: "Couples", color: "from-rose-400 to-orange-500" },
  { name: "Solo Souls", members: "21.2k", tag: "Solo", color: "from-emerald-500 to-teal-500" },
];

export function Community() {
  return (
    <section id="community" className="relative py-28 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Community</p>
        <h2 className="text-4xl md:text-6xl font-display font-light">
          You'll never travel <span className="italic text-gradient-ocean">alone.</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Join thousands of travelers sharing stories, photos, and trips you can actually book together.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {groups.map((g, i) => (
          <motion.div
            key={g.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="relative overflow-hidden rounded-3xl p-6 text-white aspect-[4/5] flex flex-col justify-between"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${g.color}`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white/20,transparent_60%)]" />
            <div className="relative">
              <span className="glass px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest">{g.tag}</span>
            </div>
            <div className="relative">
              <Users className="w-6 h-6 mb-3 opacity-80" />
              <div className="font-display text-2xl">{g.name}</div>
              <div className="text-sm text-white/80 mt-1">{g.members} travelers</div>
              <button className="mt-5 w-full glass rounded-full py-2.5 text-sm font-medium hover:bg-white/20 transition">
                Join group
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        {[
          { icon: Heart, k: "1.2M", v: "Saved trips" },
          { icon: MessageCircle, k: "84k", v: "Reviews & stories" },
          { icon: Users, k: "320k", v: "Active travelers" },
        ].map((s) => (
          <div key={s.v} className="rounded-2xl border border-border bg-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl gradient-ocean grid place-items-center text-white">
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display text-2xl">{s.k}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.v}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
