import {
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Github,
  Globe,
  Mail,
  Music2,
  ShoppingBag,
  MessageCircle,
  Send,
  type LucideIcon,
} from "lucide-react";

export type IconKey =
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

export const ICONS: Record<IconKey, { label: string; Icon: LucideIcon }> = {
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

export type ThemeKey = "light" | "dark" | "gradient" | "sunset";

export const THEMES: Record<ThemeKey, { label: string; className: string; swatch: string }> = {
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

export interface BioLink {
  id: string;
  title: string;
  url: string;
  icon: string;
}

export interface BioProfile {
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  theme: string;
}

export const FALLBACK_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" rx="100" fill="%23cbd5e1"/><circle cx="100" cy="80" r="34" fill="%2394a3b8"/><path d="M40 190c8-40 32-58 60-58s52 18 60 58z" fill="%2394a3b8"/></svg>`,
  );

export function normalizeUrl(raw: string) {
  const value = raw.trim();
  if (!value) return "#";
  if (/^(https?:|mailto:|tel:)/i.test(value)) return value;
  return `https://${value}`;
}

export function themeClassOf(theme: string) {
  return (THEMES[theme as ThemeKey] ?? THEMES.gradient).className;
}

export function BioPreview({
  profile,
  links,
  className = "",
}: {
  profile: BioProfile;
  links: BioLink[];
  className?: string;
}) {
  return (
    <div
      className={`preview-surface flex flex-col rounded-[1.9rem] px-6 py-8 ${themeClassOf(profile.theme)} ${className}`}
    >
      <div className="flex flex-col items-center text-center">
        <img
          src={profile.avatar_url || FALLBACK_AVATAR}
          alt={profile.display_name || "الصورة الشخصية"}
          loading="lazy"
          className="h-24 w-24 rounded-full border-4 border-current/20 object-cover shadow-lg"
        />
        <h2 className="mt-4 text-xl font-black">{profile.display_name || "اسمك هنا"}</h2>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--preview-muted)" }}>
          {profile.bio || "نبذة تعريفية قصيرة عنك"}
        </p>
      </div>

      <div className="mt-7 flex-1 space-y-3">
        {links.length === 0 ? (
          <p className="rounded-2xl border border-dashed p-6 text-center text-sm opacity-80">
            ستظهر روابطك هنا
          </p>
        ) : (
          links.map((link) => {
            const { Icon } = ICONS[link.icon as IconKey] ?? ICONS.website;
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
        صُنعت بواسطة Linktood ✦ أنشئ صفحتك مجاناً
        <br />© أحمد السيد أبو دوم
      </p>
    </div>
  );
}