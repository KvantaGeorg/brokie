import { useEffect, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";

/* A full-height sheet that slides up inside the phone. */
const SheetShell = ({ title, onClose, onBack, children }: { title: string; onClose: () => void; onBack?: () => void; children: ReactNode }) => {
  const still = useReducedMotion() ?? false;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      initial={still ? { opacity: 0 } : { y: "100%" }}
      animate={still ? { opacity: 1 } : { y: 0 }}
      exit={still ? { opacity: 0 } : { y: "100%" }}
      transition={{ type: "spring", stiffness: 380, damping: 36 }}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      className="absolute inset-0 z-40 flex flex-col bg-[hsl(258_42%_10%)] text-white"
    >
      <div className="flex items-center justify-between px-5 pt-11 pb-2 h-[76px]">
        {onBack ? (
          <button type="button" onClick={onBack} className="inline-flex items-center -ml-1.5 rounded-lg px-1.5 py-1 text-[12px] font-extrabold text-white/60 hover:text-white">
            <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Back
          </button>
        ) : (
          <span />
        )}
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center">
          <X className="w-4 h-4" strokeWidth={3} aria-hidden="true" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar px-6 pb-6 flex flex-col">{children}</div>
    </motion.div>
  );
};

export const SheetButton = ({ children, onClick, disabled, variant = "accent", type = "button" }: { children: ReactNode; onClick?: () => void; disabled?: boolean; variant?: "accent" | "ghost"; type?: "button" | "submit" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={
      variant === "accent"
        ? "w-full h-11 rounded-xl bg-accent text-accent-foreground text-[14px] font-black shadow-[0_3px_0_hsl(var(--accent-deep))] active:translate-y-0.5 active:shadow-none disabled:bg-white/10 disabled:text-white/40 disabled:shadow-none inline-flex items-center justify-center gap-2"
        : "w-full h-10 rounded-xl text-[13px] font-extrabold text-white/60 hover:text-white"
    }
  >
    {children}
  </button>
);

export default SheetShell;
