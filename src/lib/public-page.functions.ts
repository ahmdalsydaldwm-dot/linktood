import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const getPublicPage = createServerFn({ method: "GET" })
  .inputValidator((username: string) => String(username).toLowerCase())
  .handler(async ({ data: username }) => {
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const supabasePublic = createClient<Database>(process.env.SUPABASE_URL!, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
            h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { data: profile } = await supabasePublic
      .from("profiles")
      .select("id, username, display_name, bio, avatar_url, theme")
      .eq("username", username)
      .maybeSingle();

    if (!profile) return null;

    const { data: links } = await supabasePublic
      .from("links")
      .select("id, title, url, icon, position")
      .eq("user_id", profile.id)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

    return {
      profile: {
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        theme: profile.theme,
      },
      links: (links ?? []).map((l) => ({ id: l.id, title: l.title, url: l.url, icon: l.icon })),
    };
  });