import type { ReactNode } from "react";

/* Shared section heading: optional eyebrow, a big title and one supporting line. */
export const SectionHeader = ({ label, title, desc, center = false, className = "" }: { label?: string; title: ReactNode; desc?: ReactNode; center?: boolean; className?: string }) => (
  <div className={`max-w-2xl mb-12 lg:mb-16 ${center ? "mx-auto text-center" : ""} ${className}`}>
    {label && <p className="micro-label mb-4">{label}</p>}
    <h2 className="text-foreground leading-[1.05]" style={{ fontSize: "clamp(34px, 4.8vw, 56px)" }}>
      {title}
    </h2>
    {desc && <p className="text-muted-foreground text-[18px] font-semibold leading-relaxed mt-5">{desc}</p>}
  </div>
);
