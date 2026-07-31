import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Link as LinkIcon,
  Palette,
  ImagePlus,
  Sparkles,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  BarChart3,
  QrCode,
  Star,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BioPreview, THEMES, type ThemeKey, type BioLink } from "@/lib/bio";
import { useUi } from "@/lib/ui-prefs";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Linktood | منصة روابط البايو الفاخرة برابط مخصص" },
      {
        name: "description",
        content:
          "أنشئ صفحة روابط بايو فاخرة برابط مخصص وصورة شخصية وقوالب زجاجية ونيومورفيزم، بالعربية والإنجليزية، ووضع ليلي أنيق.",
      },
      { property: "og:title", content: "Linktood | منصة روابط البايو الفاخرة" },
      {
        property: "og:description",
        content: "رابط مخصص، قوالب فاخرة، عربي/إنجليزي، ومعاينة حية لصفحة روابطك.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function Index() {
  const { t, pick, dir } = useUi();
  const [theme, setTheme] = useState<ThemeKey>("midnight");
  const [signedIn, setSignedIn] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
  }, []);

  const ctaTo = signedIn ? "/dashboard" : "/auth";
  const ctaLabel = signedIn ? t("ctaDashboard") : t("ctaStart");

  const demoLinks: BioLink[] = [
    { id: "1", title: pick("تابعني على إنستغرام", "Follow on Instagram"), url: "#", icon: "instagram" },
    { id: "2", title: pick("قناتي على يوتيوب", "My YouTube channel"), url: "#", icon: "youtube" },
    { id: "3", title: pick("موقعي الشخصي", "Personal website"), url: "#", icon: "website" },
    { id: "4", title: pick("متجري الإلكتروني", "My online store"), url: "#", icon: "store" },
  ];

  const features = [
    {
      Icon: LinkIcon,
      title: pick("رابط مخصص لك", "Your custom handle"),
      desc: pick(
        "اختر اسم المستخدم الخاص بك وشارك رابطاً واحداً يجمع كل حساباتك.",
        "Pick your username and share one link that holds every account.",
      ),
    },
    {
      Icon: ImagePlus,
      title: pick("صورة شخصية", "Avatar upload"),
      desc: pick(
        "ارفع صورتك مباشرة من جهازك لتظهر في أعلى صفحتك بشكل احترافي.",
        "Upload your photo straight from your device for a polished header.",
      ),
    },
    {
      Icon: Palette,
      title: pick("قوالب فاخرة", "Premium templates"),
      desc: pick(
        "قوالب زجاجية ونيومورفيزم ومتدرجات فاخرة، بنقرة واحدة.",
        "Glass, neumorphism and luxury gradient templates in one click.",
      ),
    },
    {
      Icon: ShieldCheck,
      title: pick("دخول آمن", "Secure sign-in"),
      desc: pick(
        "سجّل الدخول بجوجل أو البريد، وبياناتك محفوظة في حسابك فقط.",
        "Sign in with Google or email — your data stays scoped to you.",
      ),
    },
    {
      Icon: Smartphone,
      title: pick("متجاوب بالكامل", "Fully responsive"),
      desc: pick(
        "تصميم مبني للهواتف أولاً ويتسع بأناقة للتابلت والحاسوب.",
        "Mobile-first design that scales beautifully to tablet and desktop.",
      ),
    },
    {
      Icon: Sparkles,
      title: pick("معاينة حية", "Live preview"),
      desc: pick(
        "شاهد التغييرات لحظة بلحظة داخل إطار هاتف قبل النشر.",
        "Watch every change instantly inside a real phone frame.",
      ),
    },
    {
      Icon: BarChart3,
      title: pick("عربي وإنجليزي", "Arabic & English"),
      desc: pick(
        "تبديل فوري بين العربية والإنجليزية مع دعم كامل للاتجاهين.",
        "Instant Arabic/English switching with full RTL and LTR support.",
      ),
    },
    {
      Icon: QrCode,
      title: pick("مشاركة سريعة", "Fast sharing"),
      desc: pick(
        "انسخ رابطك أو افتح صفحتك العامة بضغطة واحدة من لوحة التحكم.",
        "Copy your link or open your public page in a single tap.",
      ),
    },
    {
      Icon: Star,
      title: pick("وضع ليلي أنيق", "Elegant dark mode"),
      desc: pick(
        "هوية Midnight Indigo بوضعين فاتح وداكن مصمّمين بعناية.",
        "A Midnight Indigo identity with carefully tuned light and dark modes.",
      ),
    },
  ];

  const stats = [
    { value: "٩٩.٩٪", valueEn: "99.9%", label: pick("جهوزية الخدمة", "Uptime") },
    { value: "< ١ دقيقة", valueEn: "< 1 min", label: pick("لإنشاء صفحتك", "To build your page") },
    { value: "٧", valueEn: "7", label: pick("قوالب جاهزة", "Ready templates") },
    { value: "١٢", valueEn: "12", label: pick("أيقونة تطبيقات", "App icons") },
  ];

  const testimonials = [
    {
      name: pick("سارة العبدالله", "Sara Alabdullah"),
      role: pick("مصمّمة منتجات", "Product designer"),
      text: pick(
        "أنظف صفحة روابط استخدمتها — القوالب تبدو كأنها من تطبيق بقيمة ملايين.",
        "The cleanest bio page I've used — the templates feel like a premium app.",
      ),
    },
    {
      name: pick("محمود حسن", "Mahmoud Hassan"),
      role: pick("صانع محتوى", "Content creator"),
      text: pick(
        "المعاينة الحية وفّرت عليّ وقتاً كبيراً، وكل شيء يعمل بسلاسة على الهاتف.",
        "The live preview saved me hours, and everything is smooth on mobile.",
      ),
    },
    {
      name: pick("نور الدين", "Nour Eldin"),
      role: pick("صاحب متجر إلكتروني", "Store owner"),
      text: pick(
        "رابط واحد لكل قنواتي ومتجري، والتبديل بين العربية والإنجليزية ممتاز.",
        "One link for all my channels and store, and the bilingual switch is superb.",
      ),
    },
  ];

  const faqs = [
    {
      q: pick("هل الاستخدام مجاني؟", "Is it free to use?"),
      a: pick(
        "نعم، إنشاء صفحتك وإدارة روابطك وتغيير القوالب مجاني بالكامل.",
        "Yes — creating your page, managing links and switching templates is free.",
      ),
    },
    {
      q: pick("كيف أحصل على رابط مخصص؟", "How do I get a custom link?"),
      a: pick(
        "من لوحة التحكم اكتب اسم المستخدم الذي تريده ليصبح رابطك /u/username.",
        "In the dashboard, type the username you want and your link becomes /u/username.",
      ),
    },
    {
      q: pick("هل يمكنني تعديل روابطي لاحقاً؟", "Can I edit links later?"),
      a: pick(
        "بالتأكيد، لكل رابط زر تعديل لتغيير العنوان والرابط والأيقونة في أي وقت.",
        "Absolutely — every link has an edit button for its title, URL and icon.",
      ),
    },
    {
      q: pick("هل الصفحة تدعم العربية؟", "Does it support Arabic?"),
      a: pick(
        "نعم، الموقع يدعم العربية والإنجليزية مع اتجاه صحيح للنصوص في كل الصفحات.",
        "Yes — the whole platform supports Arabic and English with correct text direction.",
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader signedIn={signedIn} />

      <main>
        {/* Hero */}
        <section className="aurora relative overflow-hidden">
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:py-24">
            <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.6 }}>
              <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {t("heroBadge")}
              </span>
              <h1 className="mt-6 text-4xl leading-[1.12] font-black sm:text-5xl lg:text-6xl">
                {t("heroTitle1")}{" "}
                <span className="text-gradient">{t("heroTitleGrad")}</span>{" "}
                {t("heroTitle2")}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("heroSub")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={ctaTo}
                  className="btn-brand inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold"
                >
                  {ctaLabel}
                  <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                </Link>
                <a
                  href="#features"
                  className="glass inline-flex items-center rounded-full px-7 py-3.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
                >
                  {t("ctaExplore")}
                </a>
              </div>

              <div className="mt-9">
                <p className="mb-2.5 text-[11px] font-bold text-muted-foreground">{t("tryThemes")}</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-bold transition-all hover:-translate-y-0.5 ${
                        theme === key ? "border-primary ring-2 ring-ring" : "border-border"
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{ background: THEMES[key].swatch }}
                      />
                      {pick(THEMES[key].label, THEMES[key].labelEn)}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mx-auto w-full max-w-[360px] rounded-[2.75rem] border-[10px] border-foreground/85 bg-foreground/85 shadow-2xl"
            >
              <BioPreview
                profile={{
                  username: "sara",
                  display_name: pick("سارة العبدالله", "Sara Alabdullah"),
                  bio: pick(
                    "مصمّمة منتجات رقمية · أشارك تجربتي في التصميم وريادة الأعمال",
                    "Digital product designer · sharing design & startup lessons",
                  ),
                  avatar_url: "https://i.pravatar.cc/300?img=12",
                  theme,
                }}
                links={demoLinks}
                className="h-[600px] overflow-y-auto"
              />
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-black sm:text-3xl">{t("featuresTitle")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
            {t("featuresSub")}
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ Icon, title, desc }, i) => (
              <motion.article
                key={title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="glass card-hover rounded-3xl p-6"
              >
                <span className="btn-brand grid h-11 w-11 place-items-center rounded-2xl">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Templates */}
        <section id="templates" className="aurora py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-2xl font-black sm:text-3xl">{t("templatesTitle")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
              {t("templatesSub")}
            </p>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(Object.keys(THEMES) as ThemeKey[]).slice(0, 6).map((key, i) => (
                <motion.button
                  key={key}
                  onClick={() => setTheme(key)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  className="glass card-hover overflow-hidden rounded-[2rem] p-4 text-start"
                >
                  <div className="overflow-hidden rounded-3xl">
                    <BioPreview
                      profile={{
                        username: "demo",
                        display_name: pick("اسمك هنا", "Your name"),
                        bio: pick("نبذة قصيرة عنك", "A short bio about you"),
                        avatar_url: `https://i.pravatar.cc/200?img=${20 + i}`,
                        theme: key,
                      }}
                      links={demoLinks.slice(0, 3)}
                      className="pointer-events-none h-[330px] scale-[0.98]"
                    />
                  </div>
                  <p className="mt-3 px-1 text-sm font-bold">
                    {pick(THEMES[key].label, THEMES[key].labelEn)}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-black sm:text-3xl">{t("statsTitle")}</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="glass rounded-3xl p-6 text-center"
              >
                <p className="text-gradient text-2xl font-black sm:text-3xl">
                  {pick(s.value, s.valueEn)}
                </p>
                <p className="mt-2 text-xs font-semibold text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="text-center text-2xl font-black sm:text-3xl">{t("testimonialsTitle")}</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {testimonials.map((item, i) => (
              <motion.figure
                key={item.name}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass card-hover rounded-3xl p-6"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-current text-primary" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed">{item.text}</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <img
                    src={`https://i.pravatar.cc/80?img=${30 + i}`}
                    alt={item.name}
                    loading="lazy"
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{item.name}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {item.role}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-4 pb-16">
          <h2 className="text-center text-2xl font-black sm:text-3xl">{t("faqTitle")}</h2>
          <div className="mt-10 space-y-3">
            {faqs.map((item, i) => (
              <div key={item.q} className="glass overflow-hidden rounded-3xl">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start text-sm font-bold"
                >
                  <span className="min-w-0">{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i ? (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="glass aurora rounded-[2.5rem] p-8 text-center sm:p-14">
            <h2 className="text-2xl font-black sm:text-4xl">{t("finalTitle")}</h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">{t("finalSub")}</p>
            <Link
              to={ctaTo}
              className="btn-brand mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold"
            >
              {ctaLabel}
              <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}