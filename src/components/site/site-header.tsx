import { Link } from "@tanstack/react-router";
import logo from "@/assets/linktood-logo.png";
import { useUi } from "@/lib/ui-prefs";
import { PrefsToggles } from "./prefs-toggles";

export function SiteHeader({ signedIn }: { signedIn: boolean }) {
  const { t } = useUi();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={logo}
            alt="Linktood"
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-2xl shadow-lg"
          />
          <span className="min-w-0">
            <span className="block truncate text-lg leading-tight font-black">Linktood</span>
            <span className="block truncate text-[11px] text-muted-foreground">
              {t("brandTag")}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex">
            <a
              href="#features"
              className="rounded-full px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {t("navFeatures")}
            </a>
            <a
              href="#templates"
              className="rounded-full px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {t("navTemplates")}
            </a>
            <a
              href="#faq"
              className="rounded-full px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {t("navFaq")}
            </a>
          </nav>
          <PrefsToggles />
          <Link
            to={signedIn ? "/dashboard" : "/auth"}
            className="btn-brand shrink-0 rounded-full px-4 py-2.5 text-xs font-bold"
          >
            {signedIn ? t("dashboard") : t("signIn")}
          </Link>
        </div>
      </div>
    </header>
  );
}