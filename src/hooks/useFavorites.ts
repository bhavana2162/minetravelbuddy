import { useEffect, useState, useCallback } from "react";

const KEY = "nova-favorites";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function useFavorites() {
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => { setFavs(read()); }, []);

  const toggle = useCallback((id: string) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      window.dispatchEvent(new Event("nova-favs-changed"));
      return next;
    });
  }, []);

  useEffect(() => {
    const h = () => setFavs(read());
    window.addEventListener("nova-favs-changed", h);
    return () => window.removeEventListener("nova-favs-changed", h);
  }, []);

  return { favs, toggle, isFav: (id: string) => favs.includes(id) };
}
