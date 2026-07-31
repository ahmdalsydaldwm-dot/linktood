import { Languages, Moon, Sun } from "lucide-react";
import { useUi } from "@/lib/ui-prefs";

export function PrefsToggles() {
  const { toggleLang, toggleMode, mode, t, pick } = useUi();
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        onClick={toggleLang}
        aria-label={pick("تبديل اللغة", "Switch language")}
        className="grid h-10 w-10 place-items-center rounded-full border border-border text-[11px] font-black transition-colors hover:bg-accent"
      >
        <span className="sr-only">{pick("تبديل اللغة", "Switch language")}</span>
        <Languages className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        onClick={toggleMode}
        aria-label={pick("تبديل الوضع الليلي", "Toggle dark mode")}
        className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:bg-accent"
      >
        {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
      <span className="sr-only">{t("langLabel")}</span>
    </div>
  );
}