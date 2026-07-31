import logo from "@/assets/linktood-logo.png";
import { useUi } from "@/lib/ui-prefs";

export function SiteFooter() {
  const { t, pick } = useUi();
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center text-xs text-muted-foreground">
        <img
          src={logo}
          alt="Linktood"
          loading="lazy"
          width={44}
          height={44}
          className="h-11 w-11 rounded-2xl shadow-lg"
        />
        <p className="text-sm font-black text-foreground">Linktood</p>
        <p>{t("rights")}</p>
        <p>{t("company")}</p>
        <a
          href="tel:01034902816"
          className="rounded-full border border-border px-4 py-2 font-bold text-foreground transition-colors hover:bg-accent"
          dir="ltr"
        >
          01034902816
        </a>
        <p className="text-[11px]">{pick("للتواصل والدعم الفني", "Contact & technical support")}</p>
      </div>
    </footer>
  );
}