import { ArrowUpRight } from "lucide-react";
import { SITE, type SourceId } from "@/config/site";

/* "Source: Fidelity ↗" link to the survey behind a stat. */
const SourceLink = ({ id, className = "" }: { id: SourceId; className?: string }) => {
  const s = SITE.sources[id];
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      title={s.detail}
      className={`inline-flex items-center gap-0.5 text-[12px] font-bold text-muted-foreground underline decoration-white/25 underline-offset-2 hover:text-foreground hover:decoration-accent ${className}`}
    >
      Source: {s.name}
      <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
      <span className="sr-only">(opens in a new tab: {s.detail})</span>
    </a>
  );
};

export default SourceLink;
