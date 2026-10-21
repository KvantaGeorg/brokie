import { motion, useInView, useScroll, useTransform, type MotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* Headline that rises word by word. */
export const RiseWords = ({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) => (
  <span className={className}>
    {text.split(" ").map((w, i) => (
      <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
        <motion.span
          className="inline-block"
          initial={{ y: "105%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          {w}
          {" "}
        </motion.span>
      </span>
    ))}
  </span>
);

const Word = ({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
};

/* Paragraph whose words light up as it scrolls through the viewport. */
export const ScrollRevealText = ({ text, className = "", highlight = [] }: { text: string; className?: string; highlight?: string[] }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.65"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => {
        const start = i / words.length;
        const isHi = highlight.some((h) => w.toLowerCase().startsWith(h));
        return (
          <span key={i} className={isHi ? "text-primary" : ""}>
            <Word progress={scrollYProgress} range={[start, start + 1 / words.length]}>
              {w}
            </Word>
          </span>
        );
      })}
    </p>
  );
};

/* Scales and lifts its child as it scrolls into place. */
export const ScrollScale = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.35"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [10, 0]);
  return (
    <div ref={ref} className={className} style={{ perspective: 1400 }}>
      <motion.div style={{ scale, rotateX, transformOrigin: "50% 0%" }}>{children}</motion.div>
    </div>
  );
};

/* Infinite horizontal marquee. */
export const Marquee = ({ children, speed = 40 }: { children: ReactNode; speed?: number }) => (
  <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
    <div className="flex w-max animate-marquee" style={{ animationDuration: `${speed}s` }}>
      <div className="flex shrink-0">{children}</div>
      <div className="flex shrink-0" aria-hidden="true">
        {children}
      </div>
    </div>
  </div>
);

/* Odometer-style number: each digit spins through a full turn and settles on its value. */
export const RollingNumber = ({ value, className = "" }: { value: string; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const still = useReducedMotion() ?? false;
  const strip = Array.from({ length: 20 }, (_, i) => i % 10);
  let digitIndex = 0;

  return (
    <span ref={ref} className={`inline-flex leading-none ${className}`} aria-label={value}>
      {value.split("").map((ch, i) => {
        if (!/\d/.test(ch)) {
          return (
            <span key={i} aria-hidden="true" className="inline-block h-[1em] leading-none">
              {ch}
            </span>
          );
        }
        const d = Number(ch);
        const order = digitIndex++;
        return (
          <span key={i} aria-hidden="true" className="relative inline-block h-[1em] overflow-hidden">
            <motion.span
              className="flex flex-col"
              initial={{ y: still ? `-${10 + d}em` : "0em" }}
              animate={inView || still ? { y: `-${10 + d}em` } : { y: "0em" }}
              transition={{ duration: 1.4, delay: order * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              {strip.map((n, k) => (
                <span key={k} className="h-[1em] leading-none">
                  {n}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
};
