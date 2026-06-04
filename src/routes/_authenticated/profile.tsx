import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

const INTEREST_OPTIONS = [
  "Adventure", "Beach", "Mountains", "Cities", "Backpacking", "Luxury",
  "Food", "Culture", "Nightlife", "Photography", "Road Trips", "Festivals",
];

function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setCountry(profile.country ?? "");
      setBio(profile.bio ?? "");
      setAvatarUrl(profile.avatar_url ?? "");
      setInterests(profile.interests ?? []);
    }
  }, [profile]);

  const toggle = (i: string) =>
    setInterests((arr) => (arr.includes(i) ? arr.filter((x) => x !== i) : [...arr, i]));

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      name: name.trim(),
      country: country.trim() || null,
      bio: bio.trim() || null,
      avatar_url: avatarUrl.trim() || null,
      interests,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile saved");
    await refreshProfile();
    navigate({ to: "/" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold">Your profile</h1>
        <p className="text-muted-foreground mt-1">Let other travelers know who you are.</p>

        <div className="mt-8 rounded-2xl glass p-6 space-y-5">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/40" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/20 grid place-items-center">
                <UserIcon className="w-8 h-8 text-primary" />
              </div>
            )}
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Avatar URL</label>
              <input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://…"
                className="mt-1 w-full px-3 py-2 rounded-lg bg-input border border-border focus:border-primary outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-input border border-border focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Country</label>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. India"
              className="mt-1 w-full px-3 py-2 rounded-lg bg-input border border-border focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell other travelers about yourself…"
              className="mt-1 w-full px-3 py-2 rounded-lg bg-input border border-border focus:border-primary outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Travel interests</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((i) => {
                const active = interests.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggle(i)}
                    className={`px-3 py-1.5 rounded-full text-sm transition ${
                      active
                        ? "gradient-primary text-white shadow-glow"
                        : "glass hover:bg-white/10"
                    }`}
                  >
                    {i}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={save}
            disabled={saving || !name.trim()}
            className="w-full py-2.5 rounded-lg gradient-primary text-white font-semibold shadow-glow hover:scale-[1.01] transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save profile
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
