import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import BrokieMascot from "../brand/BrokieMascot";
import PhoneFrame from "./PhoneFrame";
import AppTopBar from "./phone/AppTopBar";
import SpendingScreen from "./phone/SpendingScreen";
import ChallengesScreen from "./phone/ChallengesScreen";
import LevelUpOverlay from "./phone/LevelUpOverlay";
import { PHONE_TABS, type PhoneTab } from "./phone/tabs";
import { BANKS, DEMO_PICKED_BANKS } from "@/data/banks";
import { PROFILE } from "@/data/challenges";
import { TRANSACTIONS, CATEGORIES } from "@/data/transactions";
import { GameProvider, useGame } from "@/hooks/use-game";

/* Auto-playing, non-interactive walkthrough of the app for the landing hero. Loops like a GIF. */

const SCENES = [
  { id: "splash", ms: 2800 },
  { id: "auth", ms: 3400 },
  { id: "banks", ms: 3600 },
  { id: "analyzing", ms: 2800 },
  { id: "spending", ms: 3800 },
  { id: "challenge", ms: 6200 },
] as const;

type SceneId = (typeof SCENES)[number]["id"];

/* Runs `fn` after `ms`, cleaned up when the scene unmounts. */
const useAfter = (ms: number, fn: () => void) => {
  useEffect(() => {
    const t = setTimeout(fn, ms);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

const Center = ({ children }: { children: ReactNode }) => <div className="absolute inset-0 flex flex-col items-center justify-center px-7 text-center">{children}</div>;

/* 1. Splash: the coin gets tossed, lands, and the app loads. */
const SplashScene = () => (
  <Center>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,hsl(var(--primary)/0.45),transparent_60%)]" />
    <div className="relative" style={{ perspective: 600 }}>
      <motion.div
        initial={{ y: 0, rotateY: 0 }}
        animate={{ y: [0, -130, 0, -24, 0], rotateY: [0, 540, 720, 720, 720] }}
        transition={{ duration: 1.5, times: [0, 0.4, 0.75, 0.88, 1], ease: "easeInOut" }}
      >
        <BrokieMascot mood="happy" size={96} title="" />
      </motion.div>
    </div>
    <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="relative mt-5 text-[30px] font-black">
      Brokie
    </motion.p>
    <div className="relative mt-6 w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
      <motion.div className="h-full bg-accent rounded-full" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ delay: 1.1, duration: 1.4, ease: "easeInOut" }} />
    </div>
  </Center>
);

/* 2. Sign in: email types itself, then "Log in" gets tapped. */
const EMAIL = "ruta@stud.vu.lt";
const AuthScene = () => {
  const [typed, setTyped] = useState(0);
  const [pressed, setPressed] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setTyped((n) => (n < EMAIL.length ? n + 1 : n)), 75);
    return () => clearInterval(t);
  }, []);
  useAfter(2500, () => setPressed(true));
  const passwordShown = typed >= EMAIL.length;

  return (
    <div className="absolute inset-0 flex flex-col px-6 pt-20 pb-10">
      <BrokieMascot mood="happy" size={56} title="" />
      <h3 className="text-[24px] font-black leading-tight mt-4">Welcome to Brokie</h3>
      <p className="text-[13px] font-bold text-white/55">Level up out of broke.</p>

      <div className="mt-7 space-y-2.5">
        <div className="rounded-xl bg-white/[0.07] border border-white/10 px-3.5 py-2.5">
          <p className="text-[10.5px] font-extrabold text-white/45">Email</p>
          <p className="text-[14px] font-bold h-5">
            {EMAIL.slice(0, typed)}
            {!passwordShown && <span className="inline-block w-[2px] h-4 bg-accent align-middle ml-px animate-pulse" />}
          </p>
        </div>
        <div className="rounded-xl bg-white/[0.07] border border-white/10 px-3.5 py-2.5">
          <p className="text-[10.5px] font-extrabold text-white/45">Password</p>
          <p className="text-[14px] font-black h-5 tracking-[0.2em]">{passwordShown ? "••••••••" : ""}</p>
        </div>
      </div>

      <div className="mt-auto space-y-2.5">
        <motion.div
          animate={pressed ? { y: [0, 3, 0], scale: [1, 0.97, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="h-12 rounded-2xl bg-accent text-accent-foreground font-black text-[15px] flex items-center justify-center shadow-[0_4px_0_hsl(var(--accent-deep))]"
        >
          Log in
        </motion.div>
        <div className="h-12 rounded-2xl border border-white/20 font-black text-[15px] flex items-center justify-center">Create account</div>
      </div>
    </div>
  );
};

/* 3. Connect banks: two get ticked, then Connect is tapped. */
const BanksScene = () => {
  const [picked, setPicked] = useState<string[]>([]);
  const [pressed, setPressed] = useState(false);
  useAfter(800, () => setPicked([DEMO_PICKED_BANKS[0]]));
  useAfter(1600, () => setPicked(DEMO_PICKED_BANKS));
  useAfter(2700, () => setPressed(true));

  return (
    <div className="absolute inset-0 flex flex-col px-6 pt-16 pb-10">
      <h3 className="text-[22px] font-black leading-tight">Connect your bank</h3>
      <p className="text-[12.5px] font-bold text-white/55 mt-1 flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5" aria-hidden="true" /> Read-only. Brokie never moves money.
      </p>
      <ul className="mt-5 divide-y divide-white/[0.07]">
        {BANKS.map((b) => {
          const on = picked.includes(b.id);
          return (
            <li key={b.id} className="flex items-center gap-3 py-2.5">
              <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[12px] font-black text-white/80">{b.name.slice(0, 2)}</span>
              <span className="flex-1 text-[14px] font-extrabold">{b.name}</span>
              <motion.span
                animate={on ? { scale: [0.6, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${on ? "bg-accent border-accent text-accent-foreground" : "border-white/25"}`}
              >
                {on && <Check className="w-3.5 h-3.5" strokeWidth={4} />}
              </motion.span>
            </li>
          );
        })}
      </ul>
      <motion.div
        animate={pressed ? { y: [0, 3, 0], scale: [1, 0.97, 1] } : {}}
        transition={{ duration: 0.3 }}
        className={`mt-auto h-12 rounded-2xl font-black text-[15px] flex items-center justify-center transition-colors ${
          picked.length ? "bg-accent text-accent-foreground shadow-[0_4px_0_hsl(var(--accent-deep))]" : "bg-white/10 text-white/40"
        }`}
      >
        {picked.length ? `Connect ${picked.length} bank${picked.length > 1 ? "s" : ""}` : "Choose a bank"}
      </motion.div>
    </div>
  );
};

/* 4. Analysing: the coin spins while transactions get sorted. */
const AnalyzingScene = () => {
  const steps = [`${TRANSACTIONS.length} transactions found`, `Sorted into ${CATEGORIES.length} categories`, "Spotted 1 habit to beat"];
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setShown((n) => Math.min(steps.length, n + 1)), 650);
    return () => clearInterval(t);
  }, [steps.length]);

  return (
    <Center>
      <div style={{ perspective: 600 }}>
        <motion.div animate={{ rotateY: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <BrokieMascot mood="watching" size={88} title="" />
        </motion.div>
      </div>
      <p className="mt-6 text-[19px] font-black">Analysing your spending</p>
      <ul className="mt-4 space-y-2 text-left">
        {steps.map((s, i) => (
          <motion.li
            key={s}
            initial={{ opacity: 0, x: -8 }}
            animate={i < shown ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            className="flex items-center gap-2 text-[13px] font-bold text-white/80"
          >
            <span className="w-4 h-4 rounded-full bg-chart-2 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
            </span>
            {s}
          </motion.li>
        ))}
      </ul>
    </Center>
  );
};

/* Bottom tabs, drawn but not interactive. */
const StaticTabBar = ({ active }: { active: PhoneTab }) => (
  <div className="absolute bottom-0 left-0 right-0 h-[64px] border-t border-white/10 bg-[hsl(258_42%_8%)] flex items-center justify-around px-2">
    {PHONE_TABS.map(({ id, label, icon: Icon }) => (
      <span key={id} className={`flex flex-col items-center gap-1 text-[10px] font-extrabold ${id === active ? "text-accent" : "text-white/55"}`}>
        <Icon className="w-5 h-5" strokeWidth={id === active ? 2.5 : 2} />
        {label}
      </span>
    ))}
  </div>
);

/* 5–6. Inside the app: spending, then a challenge being logged until it levels you up. */
const AppScene = ({ tab }: { tab: "spending" | "challenges" }) => {
  const { state, logProgress } = useGame();
  useAfter(1100, () => tab === "challenges" && logProgress("delivery-10"));
  useAfter(2300, () => tab === "challenges" && logProgress("delivery-10"));

  return (
    <>
      <AppTopBar streak={PROFILE.streak} totalXp={state.totalXp} level={state.level} />
      <div className="absolute top-[84px] bottom-[64px] left-0 right-0 overflow-hidden">{tab === "spending" ? <SpendingScreen /> : <ChallengesScreen showReset={false} />}</div>
      <LevelUpOverlay />
      <StaticTabBar active={tab} />
    </>
  );
};

const renderScene = (id: SceneId) => {
  switch (id) {
    case "splash":
      return <SplashScene />;
    case "auth":
      return <AuthScene />;
    case "banks":
      return <BanksScene />;
    case "analyzing":
      return <AnalyzingScene />;
    case "spending":
      return <AppScene tab="spending" />;
    case "challenge":
      return <AppScene tab="challenges" />;
  }
};

const PhoneShowcase = () => {
  const still = useReducedMotion() ?? false;
  const frameRef = useRef<HTMLElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { margin: "100px" });
  const [idx, setIdx] = useState(0);
  const [cycle, setCycle] = useState(0);

  // Advance only while visible; reduced motion stays on the spending screen
  useEffect(() => {
    if (still || !inView) return;
    const t = setTimeout(() => {
      if (idx === SCENES.length - 1) {
        setIdx(0);
        setCycle((c) => c + 1);
      } else setIdx(idx + 1);
    }, SCENES[idx].ms);
    return () => clearTimeout(t);
  }, [idx, inView, still]);

  // Decorative copy of the app: keep its controls out of the tab order and away from screen readers
  useEffect(() => {
    screenRef.current?.setAttribute("inert", "");
  }, []);

  const scene = still ? "spending" : SCENES[idx].id;

  return (
    <PhoneFrame ref={frameRef} label="Animated preview of the Brokie app: loading, signing in, connecting a bank, analysing spending, and completing a weekly challenge">
      <div ref={screenRef} aria-hidden="true" className="absolute inset-0 select-none">
        <GameProvider key={cycle}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${cycle}-${scene}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
              className="absolute inset-0"
            >
              {renderScene(scene)}
            </motion.div>
          </AnimatePresence>
        </GameProvider>
      </div>
    </PhoneFrame>
  );
};

export default PhoneShowcase;
