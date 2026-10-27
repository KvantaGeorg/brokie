import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import BrokieMascot from "../../brand/BrokieMascot";
import { levelTitle } from "@/data/challenges";
import { useGame } from "@/hooks/use-game";

const BURST = ["⭐", "🪙", "✨", "🍌", "⭐", "🪙", "✨", "🎉", "⭐", "🪙", "✨", "🎉"];

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
          className="absolute inset-0 z-40 flex flex-col items-center justify-center px-6 text-center bg-[hsl(258_55%_8%/0.82)] backdrop-blur-md"
        >
          <div className="relative">
            {!still &&
              BURST.map((e, i) => {
                const angle = (i / BURST.length) * Math.PI * 2;
                return (
                  <motion.span
                    key={i}
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 text-[20px]"
                    initial={{ x: "-50%", y: "-50%", opacity: 0, scale: 0.4 }}
                    animate={{ x: `calc(-50% + ${Math.cos(angle) * 110}px)`, y: `calc(-50% + ${Math.sin(angle) * 110}px)`, opacity: [0, 1, 1, 0], scale: 1 }}
                    transition={{ duration: 1.4, delay: 0.15, ease: "easeOut" }}
                  >
                    {e}
                  </motion.span>
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
            className="mt-4 text-[13px] font-black tracking-[0.18em] text-accent"
          >
            LEVEL UP!
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
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-2 text-[12.5px] font-bold text-white/65">
            Brokie is doing a little coin spin. You earned it.
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
