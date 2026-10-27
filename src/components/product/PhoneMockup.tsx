import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import BrokieMascot from "../brand/BrokieMascot";
import PhoneFrame from "./PhoneFrame";
import AppTopBar from "./phone/AppTopBar";
import Onboarding from "./phone/Onboarding";
import HomeScreen from "./phone/HomeScreen";
import SpendingScreen from "./phone/SpendingScreen";
import GoalsScreen from "./phone/GoalsScreen";
import ProfileScreen from "./phone/ProfileScreen";
import LearnScreen from "./phone/LearnScreen";
import WrappedStory from "./phone/WrappedStory";
import SavingsSheet from "./phone/SavingsSheet";
import AffordSheet from "./phone/AffordSheet";
import { SheetContext, type Sheet } from "./phone/sheets";
import LevelUpOverlay from "./phone/LevelUpOverlay";
import { PHONE_TABS, type PhoneTab } from "./phone/tabs";
import { Bell } from "lucide-react";
import ToneToggle from "../ToneToggle";
import { eventBanner } from "@/data/appNotifications";
import { nextPush } from "@/data/pushNotifications";
import type { Mood } from "@/data/notifications";
import { useTone } from "@/hooks/use-tone";
import { stripEmoji } from "@/lib/text";
import { PROFILE } from "@/data/challenges";
import { GameProvider, useGame, useStudent } from "@/hooks/use-game";

const BANNER_SHOW_MS = 4200;

type Banner = { id: string; mood: Mood; text: string; time?: string };

/* Brokie's banners: instant reactions to what the user just did, and a push on demand ("Notify" under the phone).
   Nothing pops up on its own. */
const useBanners = () => {
  const { state } = useGame();
  const { tone } = useTone();
  const m = useStudent();
  const [banner, setBanner] = useState<Banner | null>(null);
  const seed = useRef(Math.floor(Math.random() * 1000));
  const inApp = state.step === "done";

  const notify = () => {
    let push = nextPush(m, state, tone, seed.current);
    // never the same push twice in a row
    for (let i = 0; i < 5 && banner && push.text === banner.text; i++) push = nextPush(m, state, tone, ++seed.current);
    seed.current += 1 + Math.floor(Math.random() * 5);
    setBanner({ ...push, id: `${push.id}-${Date.now()}` });
  };

  useEffect(() => {
    if (state.event && inApp) setBanner(eventBanner(state.event, state, tone));
    // only react to a new event
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.event?.key]);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), BANNER_SHOW_MS);
    return () => clearTimeout(t);
  }, [banner]);

  return { banner: inApp ? banner : null, notify, canNotify: inApp };
};

/* Interactive app built in HTML/CSS: onboarding first, then five tabs sharing one state. Demo controls sit under the phone. */
const PhoneScreen = () => {
  const { state: game } = useGame();
  const still = useReducedMotion() ?? false;
  const { banner, notify, canNotify } = useBanners();
  const [tab, setTab] = useState<PhoneTab>("home");
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const closeSheet = () => setSheet(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const inApp = game.step === "done";

  const openTab = (next: PhoneTab) => {
    setTab(next);
    screenRef.current?.scrollTo({ top: 0 });
  };

  // Landing in the app (after onboarding or a restart) always starts on Home
  useEffect(() => {
    if (inApp) setTab("home");
  }, [inApp]);

  // Tabs pattern: arrow keys move between tabs
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const nextIdx = (idx + delta + PHONE_TABS.length) % PHONE_TABS.length;
    openTab(PHONE_TABS[nextIdx].id);
    tabRefs.current[nextIdx]?.focus();
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <SheetContext.Provider value={setSheet}>
        <PhoneFrame label="Interactive preview of the Brokie app">
          {/* Brokie banner */}
          <AnimatePresence>
            {banner && (
              <motion.div
                key={banner.id}
                role="status"
                initial={still ? { opacity: 0 } : { y: -120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={still ? { opacity: 0 } : { y: -120, opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="absolute top-10 left-2.5 right-2.5 z-20 rounded-2xl bg-[hsl(258_30%_18%/0.97)] border border-white/10 shadow-float p-3 flex gap-2.5 items-start"
              >
                <span className="shrink-0 w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
                  <BrokieMascot mood={banner.mood} size={26} title="" />
                </span>
                <span className="min-w-0">
                  <span className="flex justify-between gap-2 text-[11px] font-extrabold text-white/60">
                    <span>Brokie</span>
                    <span>{banner.time ?? "now"}</span>
                  </span>
                  <span className="block text-[13px] leading-snug font-bold">{stripEmoji(banner.text)}</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {!inApp ? (
            <Onboarding />
          ) : (
            <>
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
                    {tab === "goals" && <GoalsScreen onNavigate={openTab} />}
                    {tab === "learn" && <LearnScreen />}
                    {tab === "profile" && <ProfileScreen />}
                  </motion.div>
                </AnimatePresence>
              </div>

              <LevelUpOverlay />
              <AnimatePresence>
                {sheet?.kind === "wrapped" && <WrappedStory key="wrapped" onClose={closeSheet} />}
                {sheet?.kind === "savings" && <SavingsSheet key="savings" amount={sheet.amount} onClose={closeSheet} />}
                {sheet?.kind === "afford" && <AffordSheet key="afford" onClose={closeSheet} />}
              </AnimatePresence>

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
                      className={`flex flex-col items-center gap-1 rounded-xl px-1.5 py-1 text-[10px] font-extrabold transition-colors active:scale-95 ${
                        active ? "text-accent" : "text-white/55 hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </PhoneFrame>
      </SheetContext.Provider>

      {/* demo controls: a push on demand, and Brokie's tone */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={notify} disabled={!canNotify} className="btn btn-accent h-11 px-5 text-[14px] disabled:opacity-40 disabled:pointer-events-none">
          <Bell className="w-4 h-4" aria-hidden="true" /> Notify
        </button>
        <ToneToggle />
      </div>
      {!canNotify && <p className="-mt-2 text-[12.5px] font-semibold text-muted-foreground">Finish the sign-up in the phone to get notifications.</p>}
    </div>
  );
};

/* The demo phone keeps its progress for the browser session, so leaving /demo or reloading doesn't lose it. */
const PhoneMockup = () => (
  <GameProvider persistKey="brokie-demo-v4">
    <PhoneScreen />
  </GameProvider>
);

export default PhoneMockup;
