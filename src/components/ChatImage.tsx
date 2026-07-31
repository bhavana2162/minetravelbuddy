import { useEffect, useState } from "react";
import { ImageOff, Loader2 } from "lucide-react";
import { resolveChatImageUrl } from "@/lib/chat-images";

export function ChatImage({ src, className }: { src: string; className?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setUrl(null);
    setFailed(false);
    resolveChatImageUrl(src)
      .then((u) => { if (active) setUrl(u); })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [src]);

  if (failed) {
    return (
      <div className={`mt-2 flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-xs text-muted-foreground ${className ?? ""}`}>
        <ImageOff className="h-3.5 w-3.5" /> Image unavailable
      </div>
    );
  }

  if (!url) {
    return (
      <div className={`mt-2 grid h-40 max-w-xs place-items-center rounded-lg border border-border bg-muted ${className ?? ""}`}>
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt="Shared in chat"
      loading="lazy"
      className={`mt-2 max-w-xs rounded-lg border border-border ${className ?? ""}`}
    />
  );
}
