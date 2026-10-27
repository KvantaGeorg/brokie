import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import BrokieMascot from "../brand/BrokieMascot";
import PhoneFrame from "./PhoneFrame";
import AppTopBar from "./phone/AppTopBar";
import HomeScreen from "./phone/HomeScreen";
import SpendingScreen from "./phone/SpendingScreen";
import ChallengesScreen from "./phone/ChallengesScreen";
import ProfileScreen from "./phone/ProfileScreen";
import LevelUpOverlay from "./phone/LevelUpOverlay";
import { PHONE_TABS, type PhoneTab } from "./phone/tabs";
import { NOTIFICATIONS } from "@/data/notifications";
import { useTone } from "@/hooks/use-tone";
import { stripEmoji } from "@/lib/text";
import { PROFILE } from "@/data/challenges";
import { GameProvider, useGame } from "@/hooks/use-game";

const BANNER_MS = 4200;

/* Interactive app built in HTML/CSS, with notification banners cycling in from the top. */
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
    <PhoneFrame label="Interactive preview of the Brokie app" float={false}>
      {/* notification banner */}
      <AnimatePresence>
        {show && (
          <motion.div
            key={`${n.id}-${tone}`}
            initial={still ? { opacity: 0 } : { y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={still ? { opacity: 0 } : { y: -120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="absolute top-10 left-2.5 right-2.5 z-20 rounded-2xl bg-[hsl(258_30%_18%/0.96)] border border-white/10 shadow-float p-3 flex gap-2.5 items-start"
          >
            <span className="shrink-0 w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
              <BrokieMascot mood={n.mood} size={26} title="" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center justify-between gap-2 text-[11px] font-extrabold text-white/60">
                <span>Brokie</span>
                <span>{n.time}</span>
              </span>
              <span className="block text-[13px] leading-snug font-bold">{stripEmoji(n.text[tone])}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AppTopBar streak={PROFILE.streak} totalXp={game.totalXp} level={game.level} />

      {/* current screen */}
      <div
        ref={screenRef}
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-${tab}`}
        className="absolute top-[84px] bottom-[64px] left-0 right-0 overflow-y-auto overscroll-contain no-scrollbar"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={still ? { opacity: 0 } : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={still ? { opacity: 0 } : { opacity: 0, x: -16 }}
            transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
            className="min-h-full flex flex-col"
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
      <div role="tablist" aria-label="Brokie app screens" className="absolute bottom-0 left-0 right-0 h-[64px] border-t border-white/10 bg-[hsl(258_42%_8%)] flex items-center justify-around px-2">
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
              className={`flex flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-extrabold transition-colors active:scale-95 ${
                active ? "text-accent" : "text-white/55 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>
    </PhoneFrame>
  );
};

/* Each phone keeps its own game state, so the hero phone and the demo page don't interfere. */
const PhoneMockup = () => (
  <GameProvider>
    <PhoneScreen />
  </GameProvider>
);

export default PhoneMockup;
