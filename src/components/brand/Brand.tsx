import { SITE } from "@/config/site";

/* Text wordmark used until a real logo is added (drop an SVG/PNG into src/assets and swap it in here). */
export const Logo = ({ className = "text-[22px]" }: { className?: string }) => (
  <span className={`font-bold tracking-[-0.04em] text-foreground ${className}`}>
    {SITE.name}
    <span className="text-primary">.</span>
  </span>
);

const Badge = ({ label, url, tone }: { label: string; url: string; tone: "light" | "dark" }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center gap-1.5 text-[13px] transition-colors ${
      tone === "dark" ? "text-white/50 hover:text-white/80" : "text-muted-foreground hover:text-foreground"
    }`}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
    {label}
  </a>
);

/* Credit badges from SITE.badges, separated by dots. */
export const BackersRow = ({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) =>
  SITE.badges.length ? (
    <div className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 ${className}`}>
      {SITE.badges.map((b, i) => (
        <span key={b.label} className="contents">
          {i > 0 && <span className={`hidden sm:block w-1 h-1 rounded-full ${tone === "dark" ? "bg-white/25" : "bg-foreground/20"}`} />}
          <Badge {...b} tone={tone} />
        </span>
      ))}
    </div>
  ) : null;
