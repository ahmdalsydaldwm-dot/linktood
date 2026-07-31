import logo from "@/assets/linktood-logo.png";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useUi } from "@/lib/ui-prefs";
import { PrefsToggles } from "@/components/site/prefs-toggles";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | Linktood" },
      {
        name: "description",
        content: "سجّل الدخول إلى Linktood عبر جوجل أو البريد الإلكتروني لإدارة صفحة روابط البايو.",
      },
      { property: "og:title", content: "تسجيل الدخول | Linktood" },
      { property: "og:description", content: "ادخل إلى لوحة تحكم صفحة روابطك في Linktood." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { t, pick } = useUi();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  const signInWithGoogle = async () => {
    setError("");
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(pick("تعذّر تسجيل الدخول عبر جوجل، حاول مرة أخرى.", "Google sign-in failed, please try again."));
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  };

  const submitEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (signUpError) setError(signUpError.message);
      else
        setMessage(
          pick(
            "تم إنشاء الحساب! تفقّد بريدك لتأكيد التسجيل ثم سجّل الدخول.",
            "Account created! Check your inbox to confirm, then sign in.",
          ),
        );
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) setError(pick("بيانات الدخول غير صحيحة.", "Invalid email or password."));
      else navigate({ to: "/dashboard", replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="aurora grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-5 flex items-center justify-center">
          <PrefsToggles />
        </div>
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <img
            src={logo}
            alt="Linktood"
            width={40}
            height={40}
            className="h-10 w-10 rounded-2xl shadow-lg"
          />
          <span className="text-xl font-black">Linktood</span>
        </Link>

        <div className="glass rounded-[2rem] p-7">
          <h1 className="text-center text-xl font-black">
            {mode === "signin" ? t("authTitleIn") : t("authTitleUp")}
          </h1>
          <p className="mt-1.5 text-center text-xs text-muted-foreground">{t("authSub")}</p>

          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-background px-4 py-3.5 text-sm font-bold transition-colors hover:bg-accent disabled:opacity-60"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-8.09Z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
              />
            </svg>
            {t("withGoogle")}
          </button>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] font-semibold text-muted-foreground">{t("or")}</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submitEmail} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email")}
              dir="ltr"
              className="w-full rounded-2xl border border-input bg-background px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password")}
              dir="ltr"
              className="w-full rounded-2xl border border-input bg-background px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              {t("rememberMe")}
            </label>
            <button
              type="submit"
              disabled={loading}
              className="btn-brand flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === "signin" ? t("submitIn") : t("submitUp")}
            </button>
          </form>

          {error ? <p className="mt-3 text-xs font-semibold text-destructive">{error}</p> : null}
          {message ? <p className="mt-3 text-xs font-semibold text-primary">{message}</p> : null}

          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
              setMessage("");
            }}
            className="mt-5 w-full text-center text-xs font-semibold text-muted-foreground underline-offset-4 hover:underline"
          >
            {mode === "signin" ? t("toggleUp") : t("toggleIn")}
          </button>
        </div>
        <Link
          to="/"
          className="mt-5 block text-center text-xs font-semibold text-muted-foreground hover:underline"
        >
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}