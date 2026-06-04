import { Link, useNavigate } from "@tanstack/react-router";
import { Globe2, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg">
          <span className="w-8 h-8 rounded-lg gradient-primary grid place-items-center shadow-glow">
            <Globe2 className="w-4 h-4 text-white" />
          </span>
          Nova<span className="text-gradient">TravelVerse</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition">Communities</Link>
        </nav>

        {user ? (
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass hover:bg-white/10 transition"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <span className="w-6 h-6 rounded-full bg-primary/20 grid place-items-center">
                  <UserIcon className="w-3.5 h-3.5 text-primary" />
                </span>
              )}
              <span className="text-sm max-w-[100px] truncate">{profile?.name || "Profile"}</span>
            </Link>
            <button
              onClick={async () => { await signOut(); navigate({ to: "/" }); }}
              className="p-2 rounded-full glass hover:bg-white/10 transition"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="px-4 py-2 rounded-full gradient-primary text-white text-sm font-semibold shadow-glow hover:scale-105 transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
