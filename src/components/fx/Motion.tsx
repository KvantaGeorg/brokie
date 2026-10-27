import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

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
          <span key={i} className={isHi ? "text-accent" : ""}>
            <Word progress={scrollYProgress} range={[start, start + 1 / words.length]}>
              {w}
            </Word>
          </span>
        );
      })}
    </p>
  );
};
