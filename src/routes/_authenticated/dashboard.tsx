import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  Link as LinkIcon,
  Trash2,
  Plus,
  Palette,
  UserRound,
  Loader2,
  Copy,
  Check,
  LogOut,
  Upload,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  BioPreview,
  ICONS,
  THEMES,
  normalizeUrl,
  type IconKey,
  type ThemeKey,
  type BioLink,
} from "@/lib/bio";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم | Linktood" },
      {
        name: "description",
        content: "عدّل رابطك المخصص وصورتك الشخصية وروابطك ومظهر صفحتك مع معاينة حية.",
      },
      { property: "og:title", content: "لوحة التحكم | Linktood" },
      { property: "og:description", content: "إدارة صفحة روابط البايو الخاصة بك." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 5;

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState<{ title: string; url: string; icon: IconKey }>({
    title: "",
    url: "",
    icon: "website",
  });

  const [draft, setDraft] = useState({
    username: "",
    display_name: "",
    bio: "",
    avatar_url: null as string | null,
    theme: "gradient",
  });

  const profileQuery = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) throw new Error("no user");
      const { data, error: err } = await supabase
        .from("profiles")
        .select("id, username, display_name, bio, avatar_url, theme")
        .eq("id", userId)
        .maybeSingle();
      if (err) throw err;
      return data;
    },
  });

  const linksQuery = useQuery({
    queryKey: ["my-links"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) throw new Error("no user");
      const { data, error: err } = await supabase
        .from("links")
        .select("id, title, url, icon, position")
        .eq("user_id", userId)
        .order("position", { ascending: true })
        .order("created_at", { ascending: true });
      if (err) throw err;
      return data ?? [];
    },
  });

  useEffect(() => {
    const p = profileQuery.data;
    if (!p) return;
    setDraft({
      username: p.username,
      display_name: p.display_name,
      bio: p.bio,
      avatar_url: p.avatar_url,
      theme: p.theme,
    });
  }, [profileQuery.data]);

  const links: BioLink[] = (linksQuery.data ?? []).map((l) => ({
    id: l.id,
    title: l.title,
    url: l.url,
    icon: l.icon,
  }));

  const saveProfile = async (patch: Partial<typeof draft>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    setError("");
    setNotice("");
    const username = next.username.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      setError("الرابط يجب أن يتكون من ٣ إلى ٢٠ حرفاً إنجليزياً صغيراً أو أرقاماً أو _");
      return;
    }
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    const { error: err } = await supabase
      .from("profiles")
      .update({
        username,
        display_name: next.display_name,
        bio: next.bio,
        avatar_url: next.avatar_url,
        theme: next.theme,
      })
      .eq("id", auth.user!.id);
    setSaving(false);
    if (err) {
      setError(
        err.code === "23505" ? "هذا الرابط محجوز، جرّب اسماً آخر." : "تعذّر الحفظ، حاول مجدداً.",
      );
      return;
    }
    setNotice("تم الحفظ بنجاح ✓");
    queryClient.invalidateQueries({ queryKey: ["my-profile"] });
  };

  const uploadAvatar = async (file: File) => {
    setError("");
    setNotice("");
    if (!file.type.startsWith("image/")) {
      setError("الرجاء اختيار ملف صورة.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError("حجم الصورة يجب أن يكون أقل من ٣ ميغابايت.");
      return;
    }
    setUploading(true);
    const { data: auth } = await supabase.auth.getUser();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${auth.user!.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      setUploading(false);
      setError("تعذّر رفع الصورة، حاول مجدداً.");
      return;
    }
    const { data: signed } = await supabase.storage
      .from("avatars")
      .createSignedUrl(path, SIGNED_URL_TTL);
    setUploading(false);
    if (!signed?.signedUrl) {
      setError("تعذّر إنشاء رابط الصورة.");
      return;
    }
    await saveProfile({ avatar_url: signed.signedUrl });
  };

  const addLink = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("يرجى كتابة عنوان الزر.");
    if (!form.url.trim()) return setError("يرجى إدخال رابط صحيح.");
    const { data: auth } = await supabase.auth.getUser();
    const { error: err } = await supabase.from("links").insert({
      user_id: auth.user!.id,
      title: form.title.trim(),
      url: normalizeUrl(form.url),
      icon: form.icon,
      position: links.length,
    });
    if (err) return setError("تعذّر إضافة الرابط.");
    setForm({ title: "", url: "", icon: "website" });
    queryClient.invalidateQueries({ queryKey: ["my-links"] });
  };

  const removeLink = async (id: string) => {
    await supabase.from("links").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["my-links"] });
  };

  const publicUrl =
    typeof window !== "undefined" ? `${window.location.origin}/u/${draft.username}` : "";

  const copyUrl = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (profileQuery.isLoading) {
    return (
      <div dir="rtl" className="grid min-h-screen place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img
              src={logo}
              alt="شعار Linktood"
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-2xl"
            />
            <span className="truncate text-lg font-black">Linktood</span>
          </Link>
          <button
            onClick={signOut}
            className="flex shrink-0 items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold transition-colors hover:bg-accent"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-base font-bold">رابط صفحتك</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-input bg-background px-3 py-2">
              <span className="text-xs text-muted-foreground" dir="ltr">
                /u/
              </span>
              <input
                value={draft.username}
                onChange={(e) => setDraft({ ...draft, username: e.target.value })}
                onBlur={() => saveProfile({})}
                dir="ltr"
                className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none"
                placeholder="username"
              />
              <button
                onClick={copyUrl}
                className="rounded-lg border border-border p-2 transition-colors hover:bg-accent"
                aria-label="نسخ الرابط"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <a
                href={`/u/${draft.username}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-border p-2 transition-colors hover:bg-accent"
                aria-label="فتح الصفحة"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              حروف إنجليزية صغيرة وأرقام و _ فقط، من ٣ إلى ٢٠ خانة.
            </p>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <UserRound className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-base font-bold">الملف الشخصي</h2>
            </div>

            <div className="mb-4 flex items-center gap-4">
              <img
                src={draft.avatar_url || "https://i.pravatar.cc/300?img=12"}
                alt="الصورة الشخصية"
                className="h-16 w-16 rounded-full object-cover ring-2 ring-border"
              />
              <div>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-bold transition-colors hover:bg-accent disabled:opacity-60"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  رفع صورة شخصية
                </button>
                <p className="mt-1 text-[11px] text-muted-foreground">PNG أو JPG حتى ٣ ميغابايت</p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadAvatar(file);
                  e.target.value = "";
                }}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  الاسم الظاهر
                </span>
                <input
                  value={draft.display_name}
                  onChange={(e) => setDraft({ ...draft, display_name: e.target.value })}
                  onBlur={() => saveProfile({})}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  نبذة تعريفية
                </span>
                <input
                  value={draft.bio}
                  onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                  onBlur={() => saveProfile({})}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-base font-bold">إضافة رابط جديد</h2>
            </div>
            <form onSubmit={addLink} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="عنوان الزر"
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="رابط URL"
                dir="ltr"
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <select
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value as IconKey })}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {(Object.keys(ICONS) as IconKey[]).map((key) => (
                  <option key={key} value={key}>
                    {ICONS[key].label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 sm:col-span-3"
              >
                إضافة الرابط
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold">الروابط الحالية ({links.length})</h2>
            {links.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                لا توجد روابط بعد. أضف أول رابط من النموذج بالأعلى.
              </p>
            ) : (
              <ul className="space-y-2">
                {links.map((link) => {
                  const { Icon } = ICONS[link.icon as IconKey] ?? ICONS.website;
                  return (
                    <li
                      key={link.id}
                      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-background p-3"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{link.title}</p>
                        <p className="truncate text-xs text-muted-foreground" dir="ltr">
                          {link.url}
                        </p>
                      </div>
                      <button
                        onClick={() => removeLink(link.id)}
                        aria-label={`حذف ${link.title}`}
                        className="shrink-0 rounded-xl border border-border p-2 text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-base font-bold">المظهر</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => saveProfile({ theme: key })}
                  className={`rounded-2xl border p-3 text-xs font-semibold transition-all ${
                    draft.theme === key
                      ? "border-primary ring-2 ring-ring"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <span
                    className="mb-2 block h-10 w-full rounded-xl"
                    style={{ background: THEMES[key].swatch }}
                  />
                  {THEMES[key].label}
                </button>
              ))}
            </div>
          </section>

          {error ? <p className="text-xs font-semibold text-destructive">{error}</p> : null}
          {notice ? <p className="text-xs font-semibold text-primary">{notice}</p> : null}
          {saving ? <p className="text-xs text-muted-foreground">جارٍ الحفظ…</p> : null}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-center text-xs font-semibold text-muted-foreground">
            المعاينة الحية
          </p>
          <div className="mx-auto w-full max-w-[360px] rounded-[2.5rem] border-8 border-foreground/85 bg-foreground/85 shadow-2xl">
            <BioPreview
              profile={draft}
              links={links}
              className="h-[640px] overflow-y-auto"
            />
          </div>
        </div>
      </main>
    </div>
  );
}