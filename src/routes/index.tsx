import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Link as LinkIcon,
  Palette,
  ImagePlus,
  Sparkles,
  ShieldCheck,
  Smartphone,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BioPreview, THEMES, type ThemeKey } from "@/lib/bio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "رابطي | منشئ صفحة روابط البايو" },
      {
        name: "description",
        content:
          "أنشئ صفحة روابط بايو أنيقة: عدّل ملفك الشخصي، أضف روابط شبكاتك الاجتماعية، واختر المظهر مع معاينة حية فورية.",
      },
      { property: "og:title", content: "رابطي | منشئ صفحة روابط البايو" },
      {
        property: "og:description",
        content: "لوحة تحكم بسيطة ومعاينة حية لإنشاء صفحة روابط البايو الخاصة بك.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type IconKey =
  | "instagram"
  | "youtube"
  | "twitter"
  | "facebook"
  | "linkedin"
  | "github"
  | "website"
  | "email"
  | "music"
  | "store"
  | "whatsapp"
  | "telegram";

const ICONS: Record<IconKey, { label: string; Icon: LucideIcon }> = {
  instagram: { label: "إنستغرام", Icon: Instagram },
  youtube: { label: "يوتيوب", Icon: Youtube },
  twitter: { label: "إكس / تويتر", Icon: Twitter },
  facebook: { label: "فيسبوك", Icon: Facebook },
  linkedin: { label: "لينكدإن", Icon: Linkedin },
  github: { label: "غيت هاب", Icon: Github },
  website: { label: "موقع إلكتروني", Icon: Globe },
  email: { label: "بريد إلكتروني", Icon: Mail },
  music: { label: "موسيقى", Icon: Music2 },
  store: { label: "متجر", Icon: ShoppingBag },
  whatsapp: { label: "واتساب", Icon: MessageCircle },
  telegram: { label: "تيليجرام", Icon: Send },
};

type ThemeKey = "light" | "dark" | "gradient" | "sunset";

const THEMES: Record<ThemeKey, { label: string; className: string; swatch: string }> = {
  light: {
    label: "الوضع الفاتح",
    className: "theme-light",
    swatch: "linear-gradient(135deg,#ffffff,#e8eaf0)",
  },
  dark: {
    label: "الوضع الداكن",
    className: "theme-dark",
    swatch: "linear-gradient(135deg,#1f2430,#0f1115)",
  },
  gradient: {
    label: "المتدرج",
    className: "theme-gradient",
    swatch: "linear-gradient(135deg,#38bdf8,#a855f7)",
  },
  sunset: {
    label: "الغروب",
    className: "theme-sunset",
    swatch: "linear-gradient(135deg,#fbbf24,#ef4444)",
  },
};

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: IconKey;
}

interface Profile {
  avatar: string;
  name: string;
  bio: string;
}

interface StoredState {
  profile: Profile;
  links: LinkItem[];
  theme: ThemeKey;
}

const STORAGE_KEY = "rabti-linkinbio-v1";

const DEFAULT_STATE: StoredState = {
  profile: {
    avatar: "https://i.pravatar.cc/300?img=12",
    name: "سارة العبدالله",
    bio: "مصمّمة منتجات رقمية · أشارك تجربتي في التصميم وريادة الأعمال",
  },
  links: [
    {
      id: "1",
      title: "تابعني على إنستغرام",
      url: "https://instagram.com",
      icon: "instagram",
    },
    { id: "2", title: "قناتي على يوتيوب", url: "https://youtube.com", icon: "youtube" },
    { id: "3", title: "موقعي الشخصي", url: "https://example.com", icon: "website" },
    { id: "4", title: "تواصل معي عبر البريد", url: "mailto:hi@example.com", icon: "email" },
  ],
  theme: "gradient",
};

function normalizeUrl(raw: string) {
  const value = raw.trim();
  if (!value) return "#";
  if (/^(https?:|mailto:|tel:)/i.test(value)) return value;
  return `https://${value}`;
}

function Index() {
  const [state, setState] = useState<StoredState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [form, setForm] = useState<{ title: string; url: string; icon: IconKey }>({
    title: "",
    url: "",
    icon: "website",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredState;
        if (parsed && parsed.profile && Array.isArray(parsed.links)) {
          setState({
            profile: { ...DEFAULT_STATE.profile, ...parsed.profile },
            links: parsed.links,
            theme: parsed.theme in THEMES ? parsed.theme : DEFAULT_STATE.theme,
          });
        }
      }
    } catch {
      /* تجاهل بيانات التخزين التالفة واستخدم الافتراضي */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const themeClass = useMemo(() => THEMES[state.theme].className, [state.theme]);

  const updateProfile = (patch: Partial<Profile>) =>
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));

  const addLink = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("يرجى كتابة عنوان الزر.");
      return;
    }
    if (!form.url.trim()) {
      setError("يرجى إدخال رابط صحيح.");
      return;
    }
    setError("");
    setState((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          title: form.title.trim(),
          url: normalizeUrl(form.url),
          icon: form.icon,
        },
      ],
    }));
    setForm({ title: "", url: "", icon: "website" });
  };

  const removeLink = (id: string) =>
    setState((prev) => ({ ...prev, links: prev.links.filter((l) => l.id !== id) }));

  const resetAll = () => {
    setState(DEFAULT_STATE);
    setError("");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-5 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <LinkIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black sm:text-xl">رابطي</h1>
              <p className="truncate text-xs text-muted-foreground">
                كل روابطك في صفحة واحدة أنيقة
              </p>
            </div>
          </div>
          <button
            onClick={resetAll}
            className="shrink-0 rounded-full border border-border px-4 py-2 text-xs font-semibold transition-colors hover:bg-accent"
          >
            استعادة الافتراضي
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* لوحة التحكم */}
        <div className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <UserRound className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-base font-bold">الملف الشخصي</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  رابط الصورة الشخصية
                </span>
                <input
                  value={state.profile.avatar}
                  onChange={(e) => updateProfile({ avatar: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  الاسم الكامل
                </span>
                <input
                  value={state.profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  نبذة تعريفية
                </span>
                <input
                  value={state.profile.bio}
                  onChange={(e) => updateProfile({ bio: e.target.value })}
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
            {error ? <p className="mt-2 text-xs font-semibold text-destructive">{error}</p> : null}
          </section>

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold">الروابط الحالية ({state.links.length})</h2>
            {state.links.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                لا توجد روابط بعد. أضف أول رابط من النموذج بالأعلى.
              </p>
            ) : (
              <ul className="space-y-2">
                {state.links.map((link) => {
                  const { Icon } = ICONS[link.icon] ?? ICONS.website;
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
                  onClick={() => setState((prev) => ({ ...prev, theme: key }))}
                  className={`rounded-2xl border p-3 text-xs font-semibold transition-all ${
                    state.theme === key
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
        </div>

        {/* المعاينة الحية */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <p className="mb-3 text-center text-xs font-semibold text-muted-foreground">
            المعاينة الحية
          </p>
          <div className="mx-auto w-full max-w-[360px] rounded-[2.5rem] border-8 border-foreground/85 bg-foreground/85 shadow-2xl">
            <div
              className={`preview-surface flex h-[640px] flex-col overflow-y-auto rounded-[1.9rem] px-6 py-8 ${themeClass}`}
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={state.profile.avatar || "https://i.pravatar.cc/300?img=12"}
                  alt={state.profile.name || "الصورة الشخصية"}
                  loading="lazy"
                  className="h-24 w-24 rounded-full border-4 border-current/20 object-cover shadow-lg"
                />
                <h2 className="mt-4 text-xl font-black">{state.profile.name || "اسمك هنا"}</h2>
                <p
                  className="mt-1 text-sm leading-relaxed"
                  style={{ color: "var(--preview-muted)" }}
                >
                  {state.profile.bio || "نبذة تعريفية قصيرة عنك"}
                </p>
              </div>

              <div className="mt-7 flex-1 space-y-3">
                {state.links.length === 0 ? (
                  <p className="rounded-2xl border border-dashed p-6 text-center text-sm opacity-80">
                    ستظهر روابطك هنا
                  </p>
                ) : (
                  state.links.map((link) => {
                    const { Icon } = ICONS[link.icon] ?? ICONS.website;
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="preview-link flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold"
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="min-w-0 flex-1 truncate text-center">{link.title}</span>
                        <span className="h-4 w-4 shrink-0" />
                      </a>
                    );
                  })
                )}
              </div>

              <p
                className="mt-8 text-center text-[11px] font-semibold"
                style={{ color: "var(--preview-muted)" }}
              >
                صُنعت بواسطة رابطي ✦ أنشئ صفحتك مجاناً
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
