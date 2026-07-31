import { supabase } from "@/integrations/supabase/client";

const BUCKET = "chat-images";
export const STORAGE_PREFIX = "storage:";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "";

/** Uploads a chat image with real progress reporting. Returns a `storage:<path>` ref. */
export async function uploadChatImage(
  file: File,
  userId: string,
  onProgress: (percent: number) => void,
): Promise<string> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error("Not authenticated");

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().slice(0, 8);
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("x-upsert", "true");
    if (file.type) xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.send(file);
  });

  onProgress(100);
  return `${STORAGE_PREFIX}${path}`;
}

const signedCache = new Map<string, { url: string; expires: number }>();

/** Resolves a stored image reference to a displayable URL. */
export async function resolveChatImageUrl(ref: string): Promise<string> {
  if (!ref.startsWith(STORAGE_PREFIX)) return ref;
  const path = ref.slice(STORAGE_PREFIX.length);
  const cached = signedCache.get(path);
  if (cached && cached.expires > Date.now()) return cached.url;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  if (error || !data?.signedUrl) throw error ?? new Error("Could not load image");
  signedCache.set(path, { url: data.signedUrl, expires: Date.now() + 50 * 60 * 1000 });
  return data.signedUrl;
}
