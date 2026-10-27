import { motion } from "framer-motion";
import type { ReactNode } from "react";

/* Shared section building blocks. */

export const SectionHeader = ({ label, title, desc, center = false }: { label: string; title: ReactNode; desc?: ReactNode; center?: boolean }) => (
  <div className={`max-w-2xl mb-12 ${center ? "mx-auto text-center" : ""}`}>
    <p className="micro-label mb-4">{label}</p>
    <h2 className="text-foreground leading-[1.08]" style={{ fontSize: "clamp(30px, 4.2vw, 48px)" }}>
      {title}
    </h2>
    {desc && <p className="text-muted-foreground text-[17px] mt-4">{desc}</p>}
  </div>
);

export const FadeUp = ({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.45, delay, ease: [0.2, 0, 0, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* Blurred purple/yellow blobs placed behind a section's glass cards. */
export const Blobs = ({ variant = 0 }: { variant?: number }) => {
  const layouts = [
    ["blob blob-purple w-[420px] h-[420px] -top-20 -left-32", "blob blob-yellow w-[320px] h-[320px] top-1/3 -right-24"],
    ["blob blob-purple w-[380px] h-[380px] top-10 -right-32", "blob blob-yellow w-[280px] h-[280px] bottom-0 -left-20"],
    ["blob blob-purple w-[520px] h-[520px] -bottom-40 left-1/4", "blob blob-yellow w-[260px] h-[260px] top-0 left-10"],
  ];
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {layouts[variant % layouts.length].map((c) => (
        <div key={c} className={c} />
      ))}
    </div>
  );
};
