import { motion, useReducedMotion } from "framer-motion";

/* Hero stage: supplier browser windows keep popping open behind frosted glass,
   illustrating the "too many tabs" problem the product solves. */

type Win = {
  site: string;
  price: number;
  tabs: number;
  left: string;
  top: string;
  w: number;
  rotate: number;
  hideOnMobile?: boolean;
};

const WINDOWS: Win[] = [
  { site: "supplier-a.com", price: 324, tabs: 4, left: "-4%", top: "12%", w: 300, rotate: -4 },
  { site: "supplier-b.com", price: 316, tabs: 6, left: "70%", top: "12%", w: 320, rotate: 3 },
  { site: "supplier-c.com", price: 352, tabs: 3, left: "8%", top: "52%", w: 280, rotate: 2, hideOnMobile: true },
  { site: "supplier-d.com", price: 374, tabs: 5, left: "78%", top: "48%", w: 290, rotate: -3 },
  { site: "supplier-e.com", price: 341, tabs: 7, left: "-3%", top: "33%", w: 300, rotate: 1, hideOnMobile: true },
  { site: "supplier-f.com", price: 338, tabs: 4, left: "52%", top: "70%", w: 300, rotate: -2 },
  { site: "supplier-g.com", price: 362, tabs: 5, left: "-6%", top: "78%", w: 290, rotate: 4, hideOnMobile: true },
  { site: "supplier-a.com", price: 329, tabs: 8, left: "60%", top: "28%", w: 270, rotate: -5, hideOnMobile: true },
  { site: "supplier-b.com", price: 347, tabs: 3, left: "16%", top: "26%", w: 280, rotate: 5, hideOnMobile: true },
  { site: "supplier-c.com", price: 333, tabs: 6, left: "84%", top: "80%", w: 280, rotate: 2, hideOnMobile: true },
  { site: "supplier-e.com", price: 356, tabs: 4, left: "36%", top: "84%", w: 300, rotate: -3 },
  { site: "supplier-d.com", price: 344, tabs: 5, left: "88%", top: "24%", w: 260, rotate: 6, hideOnMobile: true },
];

const CYCLE = 14;
const LETTERS = "ABCDEFG";
const VISIBLE_TABS = 3;

/* The window's own supplier is the active tab; neighbouring suppliers fill the other tabs. */
const tabsFor = (win: Win, i: number) => {
  const own = LETTERS.indexOf(win.site.charAt(9).toUpperCase());
  const activePos = i % VISIBLE_TABS;
  return Array.from({ length: VISIBLE_TABS }, (_, t) => ({
    letter: LETTERS[(own + t - activePos + LETTERS.length) % LETTERS.length],
    active: t === activePos,
  }));
};

const BrowserWindow = ({ win, i, still }: { win: Win; i: number; still: boolean }) => (
  <motion.div
    className={`absolute ${win.hideOnMobile ? "hidden md:block" : ""}`}
    style={{ left: win.left, top: win.top, width: win.w, rotate: win.rotate }}
    initial={still ? false : { opacity: 0, scale: 0.85, y: 24 }}
    animate={still ? { opacity: 1 } : { opacity: [0, 1, 1, 0], scale: [0.85, 1, 1, 0.96], y: [24, 0, -10, -16] }}
    transition={{
      duration: CYCLE,
      times: [0, 0.06, 0.88, 1],
      delay: i * (CYCLE / WINDOWS.length),
      repeat: Infinity,
      ease: "easeOut",
    }}
  >
    <div className="rounded-xl bg-background border border-foreground/10 shadow-[0_20px_40px_-16px_rgba(0,0,0,0.25)] overflow-hidden">
      {/* tab strip */}
      <div className="flex items-end gap-1 px-2 pt-2 bg-[#ECEEED]">
        <span className="flex gap-1 mr-1 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#FF5F57]" />
          <span className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
          <span className="w-2 h-2 rounded-full bg-[#28C840]" />
        </span>
        {tabsFor(win, i).map((tab) => (
          <span
            key={tab.letter}
            className={`flex items-center gap-1 h-6 min-w-0 flex-1 px-1.5 rounded-t-md text-[10px] font-medium ${
              tab.active ? "bg-background text-foreground" : "bg-foreground/[0.06] text-muted-foreground"
            }`}
          >
            <span
              className={`shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                tab.active ? "bg-foreground text-background" : "bg-foreground/15 text-foreground/70"
              }`}
            >
              {tab.letter}
            </span>
            <span className="truncate">Supplier {tab.letter}</span>
          </span>
        ))}
        {/* the rest of the open tabs */}
        <span className="shrink-0 h-6 px-1.5 text-[9px] font-semibold leading-6 text-muted-foreground">+{win.tabs}</span>
      </div>
      {/* address bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border">
        <span className="flex-1 h-5 rounded-md bg-subtle px-2 text-[10px] leading-5 text-muted-foreground truncate">{win.site}</span>
      </div>
      {/* page */}
      <div className="p-3.5 flex items-end justify-between gap-3">
        <div className="space-y-1.5 min-w-0">
          <div className="text-[12px] font-semibold text-foreground truncate">Spree Garden Hotel, Berlin</div>
          <div className="h-1.5 w-24 rounded-full bg-foreground/10" />
          <div className="h-1.5 w-16 rounded-full bg-foreground/10" />
        </div>
        <div className="text-[20px] font-bold tabular text-foreground">€{win.price}</div>
      </div>
    </div>
  </motion.div>
);

export const TabChaos = () => {
  const still = useReducedMotion() ?? false;
  return (
  <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#EEF2EF]">
    {WINDOWS.map((w, i) => (
      <BrowserWindow key={i} win={w} i={i} still={still} />
    ))}
    {/* frosted glass: heavy in the centre where the headline sits, clear at the edges */}
    <div
      className="absolute inset-0 backdrop-blur-[24px] bg-[#F6F8F7]/65"
      style={{
        maskImage: "radial-gradient(ellipse 48% 46% at 50% 48%, #000 45%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 48% 46% at 50% 48%, #000 45%, transparent 100%)",
      }}
    />
    <div className="absolute inset-0 backdrop-blur-[4px]" />
    {/* soft green glow from below */}
    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(55%_65%_at_50%_100%,rgba(31,186,94,0.18),transparent_70%)]" />
  </div>
);
};
