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
import { BioPreview, THEMES, type ThemeKey, type BioLink } from "@/lib/bio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Linktood | صفحة روابط البايو برابط مخصص" },
      {
        name: "description",
        content:
          "أنشئ صفحة روابط بايو أنيقة برابط مخصص وصورة شخصية ومظاهر جاهزة، وسجّل الدخول بجوجل خلال ثوانٍ.",
      },
      { property: "og:title", content: "Linktood | صفحة روابط البايو برابط مخصص" },
      {
        property: "og:description",
        content: "رابط مخصص، صورة شخصية، مظاهر جميلة، ومعاينة حية لصفحة روابطك.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const DEMO_LINKS: BioLink[] = [
  { id: "1", title: "تابعني على إنستغرام", url: "#", icon: "instagram" },
  { id: "2", title: "قناتي على يوتيوب", url: "#", icon: "youtube" },
  { id: "3", title: "موقعي الشخصي", url: "#", icon: "website" },
  { id: "4", title: "متجري الإلكتروني", url: "#", icon: "store" },
];

const FEATURES = [
  {
    Icon: LinkIcon,
    title: "رابط مخصص لك",
    desc: "اختر اسم المستخدم الخاص بك وشارك رابطاً واحداً يجمع كل حساباتك.",
  },
  {
    Icon: ImagePlus,
    title: "صورة شخصية",
    desc: "ارفع صورتك مباشرة من جهازك لتظهر في أعلى صفحتك بشكل احترافي.",
  },
  {
    Icon: Palette,
    title: "مظاهر جاهزة",
    desc: "أربعة مظاهر أنيقة بين الفاتح والداكن والمتدرجات، بنقرة واحدة.",
  },
  {
    Icon: ShieldCheck,
    title: "دخول آمن بجوجل",
    desc: "سجّل الدخول بحسابك في جوجل، وبياناتك محفوظة في حسابك فقط.",
  },
  {
    Icon: Smartphone,
    title: "متجاوب بالكامل",
    desc: "تصميم مبني للهواتف أولاً ويتسع بأناقة للتابلت والحاسوب.",
  },
  {
    Icon: Sparkles,
    title: "معاينة حية",
    desc: "شاهد التغييرات لحظة بلحظة داخل إطار هاتف قبل النشر.",
  },
];

function Index() {
  const [theme, setTheme] = useState<ThemeKey>("gradient");
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
  }, []);

  const ctaTo = signedIn ? "/dashboard" : "/auth";
  const ctaLabel = signedIn ? "الذهاب إلى لوحة التحكم" : "ابدأ مجاناً بحساب جوجل";

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <LinkIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-black">Linktood</p>
              <p className="truncate text-[11px] text-muted-foreground">
                كل روابطك في صفحة واحدة أنيقة
              </p>
            </div>
          </div>
          <Link
            to={ctaTo}
            className="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {signedIn ? "لوحة التحكم" : "تسجيل الدخول"}
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_70%_0%,oklch(0.72_0.15_200/22%),transparent_60%),radial-gradient(70%_60%_at_10%_10%,oklch(0.62_0.16_320/18%),transparent_60%)]"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:py-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-bold text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                رابط واحد يكفي عن كل الروابط
              </span>
              <h1 className="mt-5 text-4xl leading-[1.15] font-black sm:text-5xl">
                صفحة روابط بايو
                <span className="bg-[linear-gradient(90deg,oklch(0.68_0.16_200),oklch(0.62_0.18_320))] bg-clip-text text-transparent">
                  {" "}
                  برابطك المخصص{" "}
                </span>
                وصورتك الشخصية
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                أنشئ صفحتك خلال دقيقة: عدّل رابطك الخاص، ارفع صورتك، أضف روابط شبكاتك الاجتماعية،
                واختر المظهر — كل ذلك مع معاينة حية فورية.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to={ctaTo}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  {ctaLabel}
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-bold transition-colors hover:bg-accent"
                >
                  تعرّف على المزايا
                </a>
              </div>

              <div className="mt-8">
                <p className="mb-2 text-[11px] font-bold text-muted-foreground">جرّب المظاهر:</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-bold transition-all ${
                        theme === key ? "border-primary ring-2 ring-ring" : "border-border"
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{ background: THEMES[key].swatch }}
                      />
                      {THEMES[key].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[360px] rounded-[2.5rem] border-8 border-foreground/85 bg-foreground/85 shadow-2xl">
              <BioPreview
                profile={{
                  username: "sara",
                  display_name: "سارة العبدالله",
                  bio: "مصمّمة منتجات رقمية · أشارك تجربتي في التصميم وريادة الأعمال",
                  avatar_url: "https://i.pravatar.cc/300?img=12",
                  theme,
                }}
                links={DEMO_LINKS}
                className="h-[600px] overflow-y-auto"
              />
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-center text-2xl font-black sm:text-3xl">كل ما تحتاجه لصفحة واحدة</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
            مزايا بسيطة ومباشرة، بدون تعقيد وبدون إعدادات مملة.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ Icon, title, desc }) => (
              <article
                key={title}
                className="rounded-3xl border border-border bg-card p-5 shadow-sm transition-transform hover:-translate-y-1"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-muted">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <h3 className="mt-4 text-base font-bold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-[2rem] border border-border bg-[linear-gradient(135deg,oklch(0.72_0.15_200/15%),oklch(0.62_0.16_320/15%))] p-8 text-center sm:p-12">
            <h2 className="text-2xl font-black sm:text-3xl">جاهز لإطلاق صفحتك؟</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              سجّل الدخول بحساب جوجل واحصل على رابطك المخصص فوراً.
            </p>
            <Link
              to={ctaTo}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5"
            >
              {ctaLabel}
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        صُنعت بواسطة Linktood ✦ أنشئ صفحتك مجاناً
      </footer>
    </div>
  );
}