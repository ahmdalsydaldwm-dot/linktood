import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "ar" | "en";
export type Mode = "light" | "dark";

const DICT = {
  brandTag: { ar: "كل روابطك في صفحة واحدة", en: "All your links, one page" },
  navFeatures: { ar: "المزايا", en: "Features" },
  navTemplates: { ar: "القوالب", en: "Templates" },
  navFaq: { ar: "الأسئلة", en: "FAQ" },
  signIn: { ar: "تسجيل الدخول", en: "Sign in" },
  dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
  heroBadge: { ar: "منصة روابط البايو الأكثر أناقة", en: "The most elegant bio link platform" },
  heroTitle1: { ar: "رابط واحد", en: "One link" },
  heroTitleGrad: { ar: "يجمع كل عالمك", en: "for your entire world" },
  heroTitle2: { ar: "الرقمي", en: "online" },
  heroSub: {
    ar: "أنشئ صفحة روابط احترافية برابط مخصص، صورة شخصية، قوالب فاخرة، ومعاينة حية فورية — بدون أي خبرة تقنية.",
    en: "Build a premium link-in-bio page with a custom handle, avatar, luxury templates and instant live preview — no code needed.",
  },
  ctaStart: { ar: "ابدأ مجاناً الآن", en: "Start free now" },
  ctaDashboard: { ar: "الذهاب إلى لوحة التحكم", en: "Go to dashboard" },
  ctaExplore: { ar: "استكشف المزايا", en: "Explore features" },
  tryThemes: { ar: "جرّب القوالب:", en: "Try templates:" },
  featuresTitle: { ar: "كل ما تحتاجه، بجودة عالمية", en: "Everything you need, world-class" },
  featuresSub: {
    ar: "أدوات مصمّمة بعناية لتمنح صفحتك مظهراً احترافياً في دقائق.",
    en: "Carefully crafted tools that make your page look premium in minutes.",
  },
  templatesTitle: { ar: "معرض القوالب", en: "Templates gallery" },
  templatesSub: {
    ar: "قوالب زجاجية، نيومورفيزم، ومتدرجات فاخرة — بنقرة واحدة.",
    en: "Glassmorphism, neumorphism and luxury gradients — one click away.",
  },
  statsTitle: { ar: "أرقام تتحدث عنّا", en: "Numbers that speak" },
  testimonialsTitle: { ar: "ماذا يقول المستخدمون", en: "What users say" },
  faqTitle: { ar: "الأسئلة الشائعة", en: "Frequently asked questions" },
  finalTitle: { ar: "جاهز لإطلاق صفحتك؟", en: "Ready to launch your page?" },
  finalSub: {
    ar: "سجّل الدخول بحساب جوجل واحصل على رابطك المخصص فوراً.",
    en: "Sign in with Google and claim your custom link instantly.",
  },
  rights: {
    ar: "جميع الحقوق محفوظة © أحمد السيد أبو دوم",
    en: "All rights reserved © Ahmed El Sayed Abu Doum",
  },
  company: {
    ar: "شركة أحمد السيد أبو دوم البرمجية — البلينا، سوهاج، مصر",
    en: "Ahmed El Sayed Abu Doum Software — El Balyana, Sohag, Egypt",
  },
  authTitleIn: { ar: "تسجيل الدخول", en: "Sign in" },
  authTitleUp: { ar: "إنشاء حساب جديد", en: "Create your account" },
  authSub: {
    ar: "أنشئ صفحة روابطك برابط مخصص وصورة شخصية",
    en: "Create your bio page with a custom link and avatar",
  },
  withGoogle: { ar: "المتابعة باستخدام جوجل", en: "Continue with Google" },
  or: { ar: "أو", en: "or" },
  email: { ar: "البريد الإلكتروني", en: "Email address" },
  password: { ar: "كلمة المرور", en: "Password" },
  rememberMe: { ar: "تذكّرني", en: "Remember me" },
  submitIn: { ar: "دخول", en: "Sign in" },
  submitUp: { ar: "إنشاء الحساب", en: "Create account" },
  toggleUp: { ar: "ليس لديك حساب؟ أنشئ واحداً", en: "No account? Create one" },
  toggleIn: { ar: "لديك حساب بالفعل؟ سجّل الدخول", en: "Already have an account? Sign in" },
  backHome: { ar: "العودة للرئيسية", en: "Back home" },
  yourLink: { ar: "رابط صفحتك", en: "Your page link" },
  profile: { ar: "الملف الشخصي", en: "Profile" },
  addLink: { ar: "إضافة رابط جديد", en: "Add a new link" },
  currentLinks: { ar: "الروابط الحالية", en: "Your links" },
  appearance: { ar: "المظهر", en: "Appearance" },
  livePreview: { ar: "المعاينة الحية", en: "Live preview" },
  signOut: { ar: "خروج", en: "Sign out" },
  langLabel: { ar: "EN", en: "ع" },
} as const;

export type DictKey = keyof typeof DICT;

type Ctx = {
  lang: Lang;
  mode: Mode;
  dir: "rtl" | "ltr";
  t: (key: DictKey) => string;
  pick: (ar: string, en: string) => string;
  toggleLang: () => void;
  toggleMode: () => void;
};

const UiPrefsContext = createContext<Ctx | null>(null);

export function UiPrefsProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    const storedLang = localStorage.getItem("linktood.lang") as Lang | null;
    const storedMode = localStorage.getItem("linktood.mode") as Mode | null;
    if (storedLang === "ar" || storedLang === "en") setLang(storedLang);
    if (storedMode === "light" || storedMode === "dark") setMode(storedMode);
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem("linktood.lang", lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem("linktood.mode", mode);
  }, [mode]);

  const t = useCallback((key: DictKey) => DICT[key][lang], [lang]);
  const pick = useCallback((ar: string, en: string) => (lang === "ar" ? ar : en), [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      mode,
      dir: lang === "ar" ? "rtl" : "ltr",
      t,
      pick,
      toggleLang: () => setLang((l) => (l === "ar" ? "en" : "ar")),
      toggleMode: () => setMode((m) => (m === "dark" ? "light" : "dark")),
    }),
    [lang, mode, t, pick],
  );

  return <UiPrefsContext.Provider value={value}>{children}</UiPrefsContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiPrefsContext);
  if (!ctx) throw new Error("useUi must be used inside UiPrefsProvider");
  return ctx;
}