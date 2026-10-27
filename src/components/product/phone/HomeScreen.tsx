import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronRight, Lock } from "lucide-react";
import BrokieMascot from "../../brand/BrokieMascot";
import { ProgressBar } from "../GameUI";
import CategoryDetail from "./CategoryDetail";
import { formatProgress } from "@/data/challenges";
import { useGame } from "@/hooks/use-game";
import type { SpendCategory } from "@/data/transactions";
import type { PhoneTab } from "./tabs";

type NodeState = "done" | "current" | "locked";

/* The spending path: one node per category, zig-zagging like a level map. */
const PATH: { id: SpendCategory; emoji: string; label: string; state: NodeState; x: number }[] = [
  { id: "rent", emoji: "🏠", label: "Rent", state: "done", x: -30 },
  { id: "groceries", emoji: "🛒", label: "Groceries", state: "done", x: 30 },
  { id: "delivery", emoji: "🛵", label: "Delivery", state: "current", x: -10 },
  { id: "goingOut", emoji: "🍻", label: "Going out", state: "locked", x: 40 },
];

const nodeStyle: Record<NodeState, string> = {
  done: "bg-accent text-accent-foreground shadow-[0_5px_0_hsl(var(--accent-deep))]",
  current: "bg-primary text-primary-foreground shadow-[0_5px_0_hsl(var(--primary-deep))] animate-node-pulse",
  locked: "bg-[hsl(258_15%_30%)] text-white/45 shadow-[0_5px_0_hsl(258_15%_20%)]",
};

type PathNodeProps = (typeof PATH)[number] & { onOpen: () => void; buttonRef: (el: HTMLButtonElement | null) => void };

const PathNode = ({ emoji, label, state, x, onOpen, buttonRef }: PathNodeProps) => (
  <div className="relative flex justify-center" style={{ transform: `translateX(${x}px)` }}>
    <button
      ref={buttonRef}
      type="button"
      onClick={onOpen}
      className={`relative w-[46px] h-[46px] rounded-full flex items-center justify-center text-[20px] transition-transform duration-150 hover:-translate-y-0.5 hover:scale-105 active:translate-y-1 active:scale-95 ${nodeStyle[state]}`}
      title={`${label}: open`}
    >
      <span aria-hidden="true" className={state === "locked" ? "grayscale opacity-60" : ""}>
        {emoji}
      </span>
      {state === "done" && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-chart-2 flex items-center justify-center ring-2 ring-[hsl(258_45%_14%)]">
          <Check className="w-3 h-3 text-white" strokeWidth={4} />
        </span>
      )}
      {state === "locked" && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[hsl(258_15%_22%)] flex items-center justify-center">
          <Lock className="w-2.5 h-2.5 text-white/60" />
        </span>
      )}
      <span className="sr-only">
        {label}, {state === "done" ? "completed" : state === "current" ? "current" : "locked"}. Open spending and insight.
      </span>
    </button>
    {state === "current" && (
      <span aria-hidden="true" className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white text-primary-deep text-[10px] font-black px-2 py-0.5 shadow">
        START
      </span>
    )}
  </div>
);

const HomeScreen = ({ onNavigate }: { onNavigate: (tab: PhoneTab) => void }) => {
  const { state } = useGame();
  const weekly = state.challenges[0];
  const still = useReducedMotion() ?? false;
  const [open, setOpen] = useState<(typeof PATH)[number] | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const returnFocusTo = useRef<SpendCategory | null>(null);

  const scrollTop = () => rootRef.current?.closest("[role=tabpanel]")?.scrollTo({ top: 0 });

  const openNode = (node: (typeof PATH)[number]) => {
    setOpen(node);
    scrollTop();
  };

  const closeNode = () => {
    returnFocusTo.current = open?.id ?? null;
    setOpen(null);
    scrollTop();
  };

  // The path remounts after the exit animation; put focus back on the node that was opened
  const nodeRef = (id: SpendCategory) => (el: HTMLButtonElement | null) => {
    if (el && returnFocusTo.current === id) {
      returnFocusTo.current = null;
      el.focus({ preventScroll: true });
    }
  };

  const slide = (dir: 1 | -1) => (still ? { opacity: 0 } : { opacity: 0, x: 20 * dir });

  return (
    <div ref={rootRef} className="flex flex-col flex-1">
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.div key="detail" initial={slide(1)} animate={{ opacity: 1, x: 0 }} exit={slide(1)} transition={{ duration: 0.18 }}>
            <CategoryDetail id={open.id} locked={open.state === "locked"} onBack={closeNode} />
          </motion.div>
        ) : (
          <motion.div key="path" initial={slide(-1)} animate={{ opacity: 1, x: 0 }} exit={slide(-1)} transition={{ duration: 0.18 }} className="flex flex-col flex-1 pb-3">
            {/* mascot + speech bubble */}
            <div className="flex items-end gap-2 px-4 mt-1">
              <BrokieMascot mood="happy" size={54} className="shrink-0" title="" />
              <div className="relative mb-5 rounded-2xl rounded-bl-sm bg-white text-[hsl(258_52%_12%)] px-3 py-2 text-[12.5px] font-extrabold leading-snug">
                Delivery is the boss this week. Let's beat it! 💪
              </div>
            </div>

            {/* level path */}
            <div className="relative mt-1 space-y-3">
              <p className="text-center text-[11px] font-black tracking-[0.12em] text-white/60 pb-3">OCTOBER · UNIT 3</p>
              {PATH.map((p) => (
                <PathNode key={p.id} {...p} onOpen={() => openNode(p)} buttonRef={nodeRef(p.id)} />
              ))}
            </div>

            {/* weekly challenge */}
            <button
              type="button"
              onClick={() => onNavigate("challenges")}
              className="mt-auto mx-3 text-left glass rounded-2xl p-3 transition-transform hover:-translate-y-0.5"
            >
              <span className="flex items-center justify-between text-[11px] font-black tracking-wide text-accent">
                <span>WEEKLY CHALLENGE</span>
                <span className="inline-flex items-center text-white/70">
                  {weekly.status === "done" ? "Done ✓" : weekly.left} <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </span>
              <span className="block text-[13px] font-extrabold text-white mt-1 leading-snug">{weekly.title}</span>
              <span className="flex items-center gap-2 mt-2">
                <ProgressBar value={weekly.progress} max={weekly.goal} label="Weekly challenge progress" className="flex-1 h-2.5" />
                <span className="text-[11px] font-black text-white tabular">{formatProgress(weekly)}</span>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeScreen;
