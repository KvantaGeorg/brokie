import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import BrokieMascot from "../brand/BrokieMascot";
import { LevelBadge, StreakFlame, XpPill } from "./GameUI";
import HomeScreen from "./phone/HomeScreen";
import SpendingScreen from "./phone/SpendingScreen";
import ChallengesScreen from "./phone/ChallengesScreen";
import ProfileScreen from "./phone/ProfileScreen";
import LevelUpOverlay from "./phone/LevelUpOverlay";
import { PHONE_TABS, type PhoneTab } from "./phone/tabs";
import { NOTIFICATIONS } from "@/data/notifications";
import { useTone } from "@/hooks/use-tone";
import { GameProvider, useGame } from "@/hooks/use-game";

const BANNER_MS = 4200;

/* Duolingo-style app screen built in HTML/CSS, with notification banners cycling in from the top. */
const PhoneScreen = () => {
  const { tone } = useTone();
  const { state: game } = useGame();
  const still = useReducedMotion() ?? false;
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState<PhoneTab>("home");
  const screenRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();

  const openTab = (next: PhoneTab) => {
    setTab(next);
    screenRef.current?.scrollTo({ top: 0 });
  };

  // Tabs pattern: arrow keys move between tabs
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const nextIdx = (idx + delta + PHONE_TABS.length) % PHONE_TABS.length;
    openTab(PHONE_TABS[nextIdx].id);
    tabRefs.current[nextIdx]?.focus();
  };

  useEffect(() => {
    // Show a banner for ~3s, hide it for ~1s, then move to the next one
    const t = setTimeout(() => {
      if (show) {
        setShow(false);
        setI((n) => (n + 1) % NOTIFICATIONS.length);
      } else setShow(true);
    }, show ? BANNER_MS - 1000 : 1000);
    return () => clearTimeout(t);
  }, [show]);

  const n = NOTIFICATIONS[i];

  return (
    <figure className="relative mx-auto w-[300px] sm:w-[320px] animate-float" aria-label="Interactive preview of the Brokie app">
      <div className="absolute -inset-8 rounded-[60px] bg-primary/30 blur-3xl" aria-hidden="true" />
      <div className="relative rounded-[46px] p-[10px] bg-[hsl(258_40%_6%)] border border-white/15 shadow-float">
        <div className="relative h-[620px] rounded-[38px] overflow-hidden bg-gradient-to-b from-[hsl(258_45%_16%)] to-[hsl(258_50%_9%)]">
          {/* notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-black z-30" aria-hidden="true" />

          {/* notification banner */}
          <AnimatePresence>
            {show && (
              <motion.div
                key={`${n.id}-${tone}`}
                initial={still ? { opacity: 0 } : { y: -120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={still ? { opacity: 0 } : { y: -120, opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="absolute top-10 left-2.5 right-2.5 z-20 glass-strong rounded-2xl p-3 flex gap-2.5 items-start"
              >
                <span className="shrink-0 w-9 h-9 rounded-xl bg-primary/30 flex items-center justify-center">
                  <BrokieMascot mood={n.mood} size={30} title="" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center justify-between gap-2 text-[11px] font-extrabold text-white/70">
                    <span>BROKIE</span>
                    <span>{n.time}</span>
                  </span>
                  <span className="block text-[13px] leading-snug font-bold text-white">{n.text[tone]}</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* top bar */}
          <div className="relative z-10 flex items-center justify-between px-5 pt-11 pb-3 text-[15px]">
            <StreakFlame count={12} />
            <motion.span key={`xp-${game.totalXp}`} initial={still ? false : { scale: 1.35 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 12 }}>
              <XpPill xp={game.totalXp} />
            </motion.span>
            <motion.span key={`lv-${game.level}`} initial={still ? false : { scale: 1.5, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <LevelBadge level={game.level} className="text-[12px] h-7 px-2.5" />
            </motion.span>
          </div>

          {/* current screen */}
          <div
            ref={screenRef}
            id={`${uid}-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-${tab}`}
            className="absolute top-[86px] bottom-[66px] left-0 right-0 overflow-y-auto overscroll-contain no-scrollbar"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={still ? { opacity: 0 } : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={still ? { opacity: 0 } : { opacity: 0, x: -16 }}
                transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                className="min-h-full flex flex-col text-white"
              >
                {tab === "home" && <HomeScreen onNavigate={openTab} />}
                {tab === "spending" && <SpendingScreen />}
                {tab === "challenges" && <ChallengesScreen />}
                {tab === "profile" && <ProfileScreen />}
              </motion.div>
            </AnimatePresence>
          </div>

          <LevelUpOverlay />

          {/* tab bar */}
          <div
            role="tablist"
            aria-label="Brokie app screens"
            className="absolute bottom-0 left-0 right-0 h-[66px] border-t border-white/10 bg-[hsl(258_50%_8%/0.9)] flex items-center justify-around px-2"
          >
            {PHONE_TABS.map(({ id, label, icon: Icon }, idx) => {
              const active = id === tab;
              return (
                <button
                  key={id}
                  ref={(el) => (tabRefs.current[idx] = el)}
                  id={`${uid}-${id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`${uid}-panel`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => openTab(id)}
                  onKeyDown={(e) => onTabKey(e, idx)}
                  className={`group flex flex-col items-center gap-0.5 rounded-xl px-1 py-1 text-[10px] font-extrabold transition-colors ${
                    active ? "text-accent" : "text-white/60 hover:text-white"
                  }`}
                >
                  <span
                    className={`w-10 h-7 rounded-lg flex items-center justify-center transition-transform group-active:scale-90 ${
                      active ? "bg-accent/15 ring-1 ring-accent/50" : "group-hover:bg-white/[0.06]"
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </figure>
  );
};

/* Each phone keeps its own game state, so the hero phone and the demo page don't interfere. */
const PhoneMockup = () => (
  <GameProvider>
    <PhoneScreen />
  </GameProvider>
);

export default PhoneMockup;
