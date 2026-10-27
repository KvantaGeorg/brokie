import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronRight, Lock } from "lucide-react";
import BrokieMascot from "../../brand/BrokieMascot";
import { ProgressBar } from "../GameUI";
import CategoryDetail from "./CategoryDetail";
import { CATEGORY_ICONS } from "./icons";
import { formatProgress } from "@/data/challenges";
import { useGame } from "@/hooks/use-game";
import type { SpendCategory } from "@/data/transactions";
import type { PhoneTab } from "./tabs";

type NodeState = "done" | "current" | "locked";

/* The spending path: one node per category, zig-zagging like a level map. */
const PATH: { id: SpendCategory; label: string; state: NodeState; x: number }[] = [
  { id: "rent", label: "Rent", state: "done", x: -34 },
  { id: "groceries", label: "Groceries", state: "done", x: 30 },
  { id: "delivery", label: "Delivery", state: "current", x: -14 },
  { id: "goingOut", label: "Going out", state: "locked", x: 38 },
];

const nodeStyle: Record<NodeState, string> = {
  done: "bg-accent text-accent-foreground shadow-[0_4px_0_hsl(var(--accent-deep))]",
  current: "bg-primary text-primary-foreground shadow-[0_4px_0_hsl(var(--primary-deep))] animate-node-pulse",
  locked: "bg-white/10 text-white/45 shadow-[0_4px_0_rgba(255,255,255,0.05)]",
};

type PathNodeProps = (typeof PATH)[number] & { onOpen: () => void; buttonRef: (el: HTMLButtonElement | null) => void };

const PathNode = ({ id, label, state, x, onOpen, buttonRef }: PathNodeProps) => {
  const Icon = state === "done" ? Check : state === "locked" ? Lock : CATEGORY_ICONS[id];
  return (
    <div className="flex flex-col items-center" style={{ transform: `translateX(${x}px)` }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={onOpen}
        className={`w-[46px] h-[46px] rounded-full flex items-center justify-center transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-1 ${nodeStyle[state]}`}
      >
        <Icon className="w-5 h-5" strokeWidth={state === "done" ? 3.5 : 2.5} aria-hidden="true" />
        <span className="sr-only">
          {label}, {state === "done" ? "completed" : state === "current" ? "current" : "locked"}. Open spending and insight.
        </span>
      </button>
      <span aria-hidden="true" className={`mt-1 text-[10.5px] font-extrabold ${state === "current" ? "text-white" : "text-white/50"}`}>
        {label}
      </span>
    </div>
  );
};

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
            {/* greeting */}
            <div className="flex items-center gap-3 px-5 mt-1">
              <BrokieMascot mood="happy" size={44} className="shrink-0" title="" />
              <div>
                <p className="text-[11px] font-extrabold text-white/50">October · Unit 3</p>
                <p className="text-[14px] font-extrabold leading-snug">Delivery is the boss this week.</p>
              </div>
            </div>

            {/* level path */}
            <div className="mt-4 space-y-0.5">
              {PATH.map((p) => (
                <PathNode key={p.id} {...p} onOpen={() => openNode(p)} buttonRef={nodeRef(p.id)} />
              ))}
            </div>

            {/* weekly challenge */}
            <button
              type="button"
              onClick={() => onNavigate("challenges")}
              className="mt-auto mx-4 text-left rounded-2xl bg-white/[0.06] border border-white/10 p-3.5 transition-colors hover:bg-white/[0.09]"
            >
              <span className="flex items-center justify-between text-[11px] font-extrabold text-white/50">
                <span>Weekly challenge</span>
                <span className="inline-flex items-center">
                  {weekly.status === "done" ? "Done" : weekly.left} <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </span>
              <span className="block text-[13px] font-extrabold mt-1 leading-snug">{weekly.title}</span>
              <span className="flex items-center gap-2 mt-2.5">
                <ProgressBar value={weekly.progress} max={weekly.goal} label="Weekly challenge progress" className="flex-1 h-2" />
                <span className="text-[11px] font-black tabular text-white/70">{formatProgress(weekly)}</span>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeScreen;
