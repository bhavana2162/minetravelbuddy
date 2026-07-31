import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Send, Smile, Reply, Trash2, Image as ImageIcon, Camera, Copy, Pencil, Check, X, Users, LogOut as LeaveIcon, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ChatImage } from "@/components/ChatImage";
import { uploadChatImage } from "@/lib/chat-images";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/c/$slug")({
  head: () => ({
    meta: [
      { title: "Community Chat | Nova TravelVerse" },
      { name: "description", content: "Join your Nova TravelVerse community conversation in real time." },
      { property: "og:title", content: "Community Chat | Nova TravelVerse" },
      { property: "og:description", content: "Join your Nova TravelVerse community conversation in real time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CommunityChat,
});

const EMOJIS = ["😀", "❤️", "😂", "🔥", "👍", "🎉"];
const PICKER_EMOJIS = [
  "😀", "😄", "😊", "😍", "😎", "🤩", "😂", "🤣",
  "❤️", "🔥", "👍", "🙏", "👏", "🎉", "✨", "💯",
  "😢", "😮", "🤔", "🥳", "🌍", "✈️", "🏖️", "🏔️",
];

type Community = {
  id: string; slug: string; name: string; description: string; cover_url: string | null;
};
type Profile = { id: string; name: string; avatar_url: string | null };
type Message = {
  id: string;
  community_id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  reply_to: string | null;
  created_at: string;
  edited_at?: string | null;
};
type Reaction = { id: string; message_id: string; user_id: string; emoji: string };
type Presence = { user_id?: string };

function mergeMessages(current: Message[], incoming: Message[]) {
  const byId = new Map(current.map((message) => [message.id, message]));
  incoming.forEach((message) => byId.set(message.id, message));
  return Array.from(byId.values()).sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime() || a.id.localeCompare(b.id),
  );
}

function CommunityChat() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<Community | null>(null);
  const [members, setMembers] = useState<Profile[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(() => new Set());
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [editing, setEditing] = useState<{ id: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [joining, setJoining] = useState(false);
  const [showEmoji, setShowEmoji] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Local object-URL preview for the queued image
  useEffect(() => {
    if (!pendingFile) { setPendingPreview(null); return; }
    const url = URL.createObjectURL(pendingFile);
    setPendingPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingFile]);


  // Load community
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("communities").select("*").eq("slug", slug).maybeSingle();
      if (!data) {
        toast.error("Community not found");
        navigate({ to: "/" });
        return;
      }
      setCommunity(data as Community);
    })();
  }, [slug, navigate]);

  // Authoritative membership check for the signed-in user
  const refreshMembership = async (cid: string) => {
    const { data: authData } = await supabase.auth.getUser();
    const uid = authData.user?.id;
    if (!uid) { setIsMember(false); return false; }
    const { data, error } = await supabase
      .from("community_members")
      .select("id")
      .eq("community_id", cid)
      .eq("user_id", uid)
      .maybeSingle();
    if (error) { console.error("[membership check]", error); return false; }
    const member = !!data;
    setIsMember(member);
    return member;
  };

  // Members list (two-step: memberships, then profiles — no FK embed available)
  const loadMembers = async (cid: string) => {
    const { data: rows, error } = await supabase
      .from("community_members")
      .select("user_id")
      .eq("community_id", cid);
    if (error) { console.error("[load members]", error); return; }
    const ids = Array.from(new Set((rows ?? []).map((r: any) => r.user_id)));
    if (!ids.length) { setMembers([]); return; }
    const { data: profs } = await supabase.from("profiles").select("id, name, avatar_url").in("id", ids);
    setMembers((profs ?? []) as Profile[]);
  };

  useEffect(() => {
    if (!community) return;
    if (!user) { setIsMember(false); return; }
    refreshMembership(community.id).then(() => loadMembers(community.id));
    // realtime member updates
    const ch = supabase
      .channel(`members-${community.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_members", filter: `community_id=eq.${community.id}` },
        () => { refreshMembership(community.id); loadMembers(community.id); },
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community?.id, user?.id]);


  // Load messages + subscribe
  useEffect(() => {
    if (!community || !isMember || !user) {
      setMessages([]);
      setProfiles({});
      setReactions([]);
      setOnlineUserIds(new Set());
      return;
    }
    setLoading(true);
    setMessages([]);
    setProfiles({});
    setReactions([]);
    let active = true;

    const ch = supabase
      .channel(`chat-${community.id}`, { config: { presence: { key: user.id } } })
      .on(
        "presence",
        { event: "sync" },
        () => {
          const state = ch.presenceState<Presence>();
          const connectedIds = new Set<string>();
          Object.values(state).flat().forEach((presence) => {
            if (presence.user_id) connectedIds.add(presence.user_id);
          });
          if (active) setOnlineUserIds(connectedIds);
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `community_id=eq.${community.id}` },
        async (payload) => {
          const m = payload.new as Message;
          setMessages((current) => mergeMessages(current, [m]));
          const { data: p } = await supabase
            .from("profiles")
            .select("id, name, avatar_url")
            .eq("id", m.user_id)
            .maybeSingle();
          if (active && p) setProfiles((current) => ({ ...current, [p.id]: p as Profile }));
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages", filter: `community_id=eq.${community.id}` },
        (payload) => setMessages((current) => current.filter((message) => message.id !== (payload.old as { id?: string }).id)),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "message_reactions" },
        async () => {
          const ids = messagesRef.current.map((message) => message.id);
          if (!ids.length) return;
          const { data } = await supabase.from("message_reactions").select("*").in("message_id", ids);
          if (active) setReactions((data ?? []) as Reaction[]);
        },
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await ch.track({ user_id: user.id, online_at: new Date().toISOString() });
        }
      });

    (async () => {
      const pageSize = 1000;
      const history: Message[] = [];
      let offset = 0;
      let messagesError: { message: string } | null = null;

      while (active) {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("community_id", community.id)
          .order("created_at", { ascending: true })
          .order("id", { ascending: true })
          .range(offset, offset + pageSize - 1);
        if (error) {
          messagesError = error;
          break;
        }
        const page = (data ?? []) as Message[];
        history.push(...page);
        if (page.length < pageSize) break;
        offset += pageSize;
      }

      if (!active) return;
      if (messagesError) {
        console.error("[load messages]", messagesError);
        setLoading(false);
        toast.error("Messages couldn't be loaded. Please try again.");
        return;
      }
      setMessages((current) => mergeMessages(current, history));

      const uids = Array.from(new Set(history.map((message) => message.user_id)));
      if (uids.length) {
        const { data: profs } = await supabase.from("profiles").select("id, name, avatar_url").in("id", uids);
        const map: Record<string, Profile> = {};
        (profs ?? []).forEach((p: any) => { map[p.id] = p; });
        if (active) setProfiles((current) => ({ ...current, ...map }));
      }

      const messageIds = history.map((message) => message.id);
      if (messageIds.length) {
        const { data: rxns } = await supabase
          .from("message_reactions")
          .select("*")
          .in("message_id", messageIds);
        if (active) setReactions((rxns ?? []) as Reaction[]);
      } else if (active) {
        setReactions([]);
      }
      if (active) setLoading(false);
    })();

    return () => {
      active = false;
      setOnlineUserIds(new Set());
      void ch.untrack();
      void supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community?.id, isMember, user?.id]);

  // keep ref for realtime callback
  const messagesRef = useRef<Message[]>([]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const join = async () => {
    if (!community || !user || joining) return;
    setJoining(true);
    try {
      const already = await refreshMembership(community.id);
      if (already) {
        await loadMembers(community.id);
        toast.info(`You're already a member of ${community.name}`);
        return;
      }

      const { error } = await supabase
        .from("community_members")
        .upsert(
          { community_id: community.id, user_id: user.id },
          { onConflict: "community_id,user_id", ignoreDuplicates: true },
        );
      if (error) throw error;

      const joined = await refreshMembership(community.id);
      await loadMembers(community.id);
      queryClient.invalidateQueries({ queryKey: ["community-counts"] });
      if (joined) toast.success(`Welcome to ${community.name}!`);
      else toast.error("We couldn't join you to this community. Please try again.");
    } catch (err) {
      console.error("[join community]", err);
      toast.error("We couldn't join you to this community. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const leave = async () => {
    if (!community || !user || joining) return;
    setJoining(true);
    try {
      const { error } = await supabase
        .from("community_members")
        .delete()
        .eq("community_id", community.id)
        .eq("user_id", user.id);
      if (error) throw error;
      await refreshMembership(community.id);
      setMessages([]);
      setMembers([]);

      queryClient.invalidateQueries({ queryKey: ["community-counts"] });
      toast.success("You left the community");
    } catch (err) {
      console.error("[leave community]", err);
      toast.error("We couldn't remove you from this community. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const send = async () => {
    if (!community || !user || (!text.trim() && !imageUrl.trim())) return;
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      community_id: community.id,
      user_id: user.id,
      content: text.trim() || (imageUrl ? "📷 image" : ""),
      image_url: imageUrl.trim() || null,
      reply_to: replyTo?.id ?? null,
    });
    setSending(false);
    if (error) {
      console.error("[send message]", error);
      return toast.error("Your message couldn't be sent. Please try again.");
    }
    setText(""); setImageUrl(""); setReplyTo(null);
  };

  const deleteMsg = async (id: string) => {
    await supabase.from("messages").delete().eq("id", id);
  };

  const react = async (messageId: string, emoji: string) => {
    if (!user) return;
    const existing = reactions.find((r) => r.message_id === messageId && r.user_id === user.id && r.emoji === emoji);
    if (existing) {
      await supabase.from("message_reactions").delete().eq("id", existing.id);
    } else {
      await supabase.from("message_reactions").insert({ message_id: messageId, user_id: user.id, emoji });
    }
    setShowEmoji(null);
  };

  const reactionsByMsg = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    reactions.forEach((r) => {
      map[r.message_id] ??= {};
      map[r.message_id][r.emoji] = (map[r.message_id][r.emoji] ?? 0) + 1;
    });
    return map;
  }, [reactions]);

  if (!community) {
    return (
      <main className="min-h-screen grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto p-12 text-center">
          <h1 className="text-2xl font-bold">{community.name}</h1>
          <p className="text-muted-foreground mt-2">Sign in to join the conversation.</p>
          <Link to="/auth" className="mt-6 inline-block px-5 py-2.5 rounded-full gradient-primary text-white font-semibold shadow-glow">
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 grid lg:grid-cols-[1fr_280px] gap-4">
        {/* Chat */}
        <div className="rounded-2xl glass overflow-hidden flex flex-col h-[calc(100vh-7rem)]">
          {/* Header */}
          <div className="relative h-28 shrink-0">
            {community.cover_url && (
              <img src={community.cover_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
            <div className="relative h-full px-5 flex items-end justify-between pb-3">
              <div className="flex items-center gap-3">
                <Link to="/" className="p-2 rounded-full glass-strong hover:bg-white/10 transition">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                  <h2 className="text-xl font-bold">{community.name}</h2>
                  <p className="text-xs text-muted-foreground">{members.length} members</p>
                </div>
              </div>
              {isMember ? (
                <button
                  onClick={leave}
                  disabled={joining}
                  className="px-3 py-1.5 rounded-full glass-strong text-sm hover:bg-destructive/20 hover:text-destructive transition flex items-center gap-1.5 disabled:opacity-60"
                >
                  {joining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LeaveIcon className="w-3.5 h-3.5" />}
                  Leave community
                </button>
              ) : (
                <button
                  onClick={join}
                  disabled={joining}
                  className="px-4 py-1.5 rounded-full gradient-primary text-white text-sm font-semibold shadow-glow hover:scale-105 transition disabled:opacity-60 disabled:hover:scale-100 flex items-center gap-1.5"
                >
                  {joining && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {joining ? "Joining…" : "Join community"}
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          {!isMember ? (
            <div className="flex-1 grid place-items-center p-8 text-center">
              <div>
                <p className="text-muted-foreground">Join this community to read and post messages.</p>
              </div>
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {loading ? (
                  <div className="grid place-items-center h-full"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-12">
                    Be the first to say hi 👋
                  </p>
                ) : (
                  messages.map((m) => {
                    const p = profiles[m.user_id];
                    const isMe = m.user_id === user.id;
                    const parent = m.reply_to ? messages.find((x) => x.id === m.reply_to) : null;
                    const parentAuthor = parent ? profiles[parent.user_id] : null;
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group flex gap-3 items-start"
                      >
                        {p?.avatar_url ? (
                          <img src={p.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary/20 grid place-items-center text-xs font-semibold shrink-0">
                            {(p?.name ?? "?").slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-sm">{p?.name ?? "Traveler"}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          {parent && (
                            <div className="mt-1 px-3 py-1.5 rounded-lg bg-muted text-xs text-muted-foreground border-l-2 border-primary">
                              <span className="font-medium text-foreground/80">{parentAuthor?.name ?? "Traveler"}</span>: {parent.content.slice(0, 80)}
                            </div>
                          )}
                          {m.content && <p className="text-sm mt-0.5 whitespace-pre-wrap break-words">{m.content}</p>}
                          {m.image_url && (
                            <img src={m.image_url} alt="" className="mt-2 max-w-xs rounded-lg border border-border" />
                          )}
                          {reactionsByMsg[m.id] && (
                            <div className="mt-1.5 flex gap-1 flex-wrap">
                              {Object.entries(reactionsByMsg[m.id]).map(([emoji, count]) => (
                                <button
                                  key={emoji}
                                  onClick={() => react(m.id, emoji)}
                                  className="px-2 py-0.5 rounded-full glass text-xs hover:bg-white/10"
                                >
                                  {emoji} {count}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1 relative">
                          <button onClick={() => setShowEmoji(showEmoji === m.id ? null : m.id)} className="p-1.5 rounded-md hover:bg-white/10" title="React">
                            <Smile className="w-4 h-4" />
                          </button>
                          <button onClick={() => setReplyTo(m)} className="p-1.5 rounded-md hover:bg-white/10" title="Reply">
                            <Reply className="w-4 h-4" />
                          </button>
                          {isMe && (
                            <button onClick={() => deleteMsg(m.id)} className="p-1.5 rounded-md hover:bg-destructive/20 hover:text-destructive" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <AnimatePresence>
                            {showEmoji === m.id && (
                              <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute right-0 top-full mt-1 px-2 py-1 rounded-full glass-strong shadow-card flex gap-1 z-10"
                              >
                                {EMOJIS.map((e) => (
                                  <button key={e} onClick={() => react(m.id, e)} className="w-7 h-7 grid place-items-center rounded-full hover:bg-white/10">
                                    {e}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Composer */}
              <div className="border-t border-border p-3 space-y-2">
                {replyTo && (
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-muted text-xs">
                    <span className="truncate">
                      Replying to <strong>{profiles[replyTo.user_id]?.name ?? "Traveler"}</strong>: {replyTo.content.slice(0, 60)}
                    </span>
                    <button onClick={() => setReplyTo(null)}><X className="w-3.5 h-3.5" /></button>
                  </div>
                )}
                {imageUrl && (
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-muted text-xs">
                    <span className="truncate">📷 {imageUrl}</span>
                    <button onClick={() => setImageUrl("")}><X className="w-3.5 h-3.5" /></button>
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <button
                    onClick={() => {
                      const url = window.prompt("Paste an image URL");
                      if (url) setImageUrl(url);
                    }}
                    className="p-2.5 rounded-lg glass hover:bg-white/10"
                    title="Share image"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    rows={1}
                    placeholder={`Message #${community.slug}`}
                    className="flex-1 px-3 py-2.5 rounded-lg bg-input border border-border focus:border-primary outline-none resize-none max-h-32"
                  />
                  <button
                    onClick={send}
                    disabled={sending || (!text.trim() && !imageUrl.trim())}
                    className="p-2.5 rounded-lg gradient-primary text-white shadow-glow disabled:opacity-50 hover:scale-105 transition"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Members sidebar */}
        <aside className="hidden lg:flex rounded-2xl glass p-4 flex-col h-[calc(100vh-7rem)]">
          <div className="flex items-center gap-2 text-sm font-semibold mb-3">
            <Users className="w-4 h-4 text-primary" />
            Members — {members.length}
          </div>
          <p className="text-xs text-muted-foreground mb-3">{community.description}</p>
          <div className="flex-1 overflow-y-auto space-y-1 -mx-1">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5">
                <div className="relative">
                  {m.avatar_url ? (
                    <img src={m.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/20 grid place-items-center text-[10px] font-semibold">
                      {(m.name ?? "?").slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-card ${
                      onlineUserIds.has(m.id) ? "bg-green-500" : "bg-muted-foreground"
                    }`}
                    aria-label={onlineUserIds.has(m.id) ? "Online" : "Offline"}
                    title={onlineUserIds.has(m.id) ? "Online" : "Offline"}
                  />
                </div>
                <span className="text-sm truncate">{m.name || "Traveler"}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
