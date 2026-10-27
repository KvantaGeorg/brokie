import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import BrokieMascot from "../../brand/BrokieMascot";
import { levelTitle } from "@/data/challenges";
import { useGame } from "@/hooks/use-game";

const BURST = Array.from({ length: 12 }, (_, i) => (i % 3 === 0 ? "bg-primary-glow" : "bg-accent"));

/* Full-screen celebration inside the phone when a new level is reached. */
const LevelUpOverlay = () => {
  const { state, dismissLevelUp } = useGame();
  const still = useReducedMotion() ?? false;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const level = state.levelUp;

  useEffect(() => {
    if (level) buttonRef.current?.focus({ preventScroll: true });
  }, [level]);

  return (
    <AnimatePresence>
      {level && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="level-up-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onKeyDown={(e) => e.key === "Escape" && dismissLevelUp()}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center px-6 text-center bg-[hsl(258_42%_10%/0.94)]"
        >
          <div className="relative">
            {!still &&
              BURST.map((color, i) => {
                const angle = (i / BURST.length) * Math.PI * 2;
                return (
                  <motion.span
                    key={i}
                    aria-hidden="true"
                    className={`absolute left-1/2 top-1/2 rounded-full ${color} ${i % 2 ? "w-2 h-2" : "w-3 h-3"}`}
                    initial={{ x: "-50%", y: "-50%", opacity: 0, scale: 0.4 }}
                    animate={{ x: `calc(-50% + ${Math.cos(angle) * 110}px)`, y: `calc(-50% + ${Math.sin(angle) * 110}px)`, opacity: [0, 1, 1, 0], scale: 1 }}
                    transition={{ duration: 1.4, delay: 0.15, ease: "easeOut" }}
                  />
                );
              })}
            <motion.div
              initial={still ? { opacity: 0 } : { scale: 0.3, rotate: -20 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 12 }}
            >
              <BrokieMascot mood="proud" size={120} title="" />
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-4 text-[12px] font-black tracking-[0.16em] text-accent"
          >
            LEVEL UP
          </motion.p>
          <motion.h2
            id="level-up-title"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 300, damping: 15 }}
            className="text-[34px] font-black leading-tight text-white"
          >
            Level {level}
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-[16px] font-extrabold text-white/85">
            You're now a <span className="text-accent">{levelTitle(level)}</span>
          </motion.p>

          <motion.button
            ref={buttonRef}
            type="button"
            onClick={dismissLevelUp}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="btn-chunky btn-accent mt-6 w-full h-12"
          >
            Keep going
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpOverlay;
