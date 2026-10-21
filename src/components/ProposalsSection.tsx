import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Calendar, Check, Clipboard, FileText, Footprints, Link2, Lock, Mail, MousePointer2, Type, Users } from "lucide-react";
import { HOTEL_PHOTOS, PhotoTile, SectionHeader, Stars } from "./product/ProductUI";
import { SITE } from "@/config/site";

/* Story in one window: type a little by hand → delete it all → click Email → everything fills in
   → click Link → the client gets a clean page with all options. */

const MANUAL_TEXT = "Hello,\n\nHere are the hotels I found:\n\n1. Spree Garden Hotel (4 stars)\n   Friedrichstraße, Ber";

const AUTO_LINES = [
  "Hello,",
  "",
  "Here are the hotel options I found for your stay.",
  "",
  "8 Oct 2026 – 10 Oct 2026 · 2 nights · 1 room · 2 adults",
  "These are alternatives: please choose one. Prices are the total for the whole stay.",
  "",
  "1. Spree Garden Hotel (4 stars)",
  "   Friedrichstraße, Berlin",
  "   Guest rating 8.6/10 (212 reviews)",
  "   5 min walk · 0.4 km to the venue",
  "   Check-in from 15:00 · Check-out until 12:00",
  "",
  "   – Double room, breakfast included",
  "     €316.00 total for 2 nights (€158.00 per night)",
  "",
  "Prices and room type are not guaranteed until booking is completed.",
  "",
  "Best regards,",
  "Your Company",
];

const OPTIONS = [
  { name: "Spree Garden Hotel", stars: 4, rating: "8.6", walk: "5 min walk", room: "Double room, breakfast", cancel: "Free cancellation until 5 Oct", price: 316, photo: HOTEL_PHOTOS.roomGarden, tag: "Recommended" },
  { name: "Mitte Central Hotel", stars: 3, rating: "8.1", walk: "1 min walk", room: "Double room, room only", cancel: "Free cancellation until 6 Oct", price: 248, photo: HOTEL_PHOTOS.roomWhite },
  { name: "Kreuzberg Loft Rooms", stars: 3, rating: "7.9", walk: "9 min walk", room: "Twin room, room only", cancel: "Non-refundable", price: 212, photo: HOTEL_PHOTOS.roomSimple },
];

// Timeline (ms)
const TYPE_END = 2400;
const DELETE_END = 2900;
const EMAIL_CLICK = 3500;
const FILL_END = 4500;
const LINK_CLICK = 5800;
const CURSOR_MS = 400; // cursor travel time before a click
const LOOP_MS = 10000; // client page stays ~4 s before the loop restarts
const TICK_MS = 60;

type Phase = "typing" | "deleting" | "toEmail" | "email" | "toLink" | "link";
type View = "email" | "link";

const phaseAt = (t: number): Phase =>
  t < TYPE_END ? "typing" : t < DELETE_END ? "deleting" : t < EMAIL_CLICK ? "toEmail" : t < LINK_CLICK - CURSOR_MS ? "email" : t < LINK_CLICK ? "toLink" : "link";

const CAPTIONS: Record<Phase, { text: string; tone: "bad" | "neutral" | "good" }> = {
  typing: { text: "Manually: copy, paste, repeat…", tone: "bad" },
  deleting: { text: "Delete it all.", tone: "neutral" },
  toEmail: { text: `With ${SITE.name}: one click.`, tone: "good" },
  email: { text: `With ${SITE.name}: one click.`, tone: "good" },
  toLink: { text: `With ${SITE.name}: one click.`, tone: "good" },
  link: { text: "Send this link to your client. That's it.", tone: "good" },
};

const fmtTime = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

const useLoopClock = (running: boolean) => {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setT((v) => (v + TICK_MS) % LOOP_MS), TICK_MS);
    return () => clearInterval(id);
  }, [running]);
  return [t, () => setT(0)] as const;
};

const ACTIONS = [
  { icon: Type, label: "Text" },
  { icon: Mail, label: "Email" },
  { icon: Link2, label: "Link" },
  { icon: FileText, label: "PDF" },
];

/* The page the client opens from the link */
const ClientDigest = () => (
  <div>
    <div className="flex items-center justify-between gap-3 pb-4 border-b border-border">
      <div className="flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center text-[11px] font-bold">A</span>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold">Your Company</div>
          <div className="text-[11px] text-muted-foreground">Prepared for you by your agent</div>
        </div>
      </div>
      <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Lock className="w-3 h-3" /> Private proposal
      </span>
    </div>

    <div className="pt-4">
      <div className="text-[13px] text-muted-foreground">Dear customer,</div>
      <h4 className="text-[22px] sm:text-[26px] font-bold tracking-[-0.03em] leading-tight mt-0.5">Your hotel options in Berlin</h4>
      <div className="flex flex-wrap gap-2 mt-3">
        {[
          { icon: Calendar, text: "8 – 10 Oct · 2 nights" },
          { icon: Users, text: "2 adults · 1 room" },
        ].map(({ icon: Icon, text }) => (
          <span key={text} className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-subtle border border-border text-[12px] font-medium">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" /> {text}
          </span>
        ))}
        <span className="inline-flex items-center h-7 px-3 rounded-full bg-success-soft text-success-text text-[12px] font-semibold">3 options</span>
      </div>
    </div>

    <div className="grid sm:grid-cols-3 gap-3 mt-5">
      {OPTIONS.map((o, i) => (
        <motion.div
          key={o.name}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.1, ease: [0.2, 0, 0, 1] }}
          className={`rounded-2xl border overflow-hidden bg-background ${i === 0 ? "border-primary/50 ring-2 ring-primary/15" : "border-border"} ${i > 0 ? "hidden sm:block" : ""}`}
        >
          <div className="relative">
            <PhotoTile photo={o.photo} tone={i} className="h-24" />
            <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-foreground text-background text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
            {o.tag && (
              <span className="absolute top-2 right-2 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-semibold">{o.tag}</span>
            )}
          </div>
          <div className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[13px] font-semibold truncate">{o.name}</div>
                <Stars n={o.stars} />
              </div>
              <span className="shrink-0 rounded-md bg-foreground text-background px-1.5 py-0.5 text-[11px] font-bold tabular">{o.rating}</span>
            </div>
            <div className="mt-2 space-y-0.5 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <Footprints className="w-3 h-3" /> {o.walk} to the venue
              </div>
              <div>{o.room}</div>
              <div className={o.cancel.startsWith("Free") ? "text-success-text" : ""}>{o.cancel}</div>
            </div>
            <div className="flex items-end justify-between mt-3">
              <div>
                <div className="text-[17px] font-bold tabular leading-none">€{o.price}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">total stay</div>
              </div>
              <span className={`inline-flex items-center h-8 px-3 rounded-lg text-[12px] font-semibold ${i === 0 ? "bg-primary text-primary-foreground" : "border border-border"}`}>
                Choose
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
    <div className="sm:hidden mt-2 text-center text-[12px] text-muted-foreground">+ 2 more options</div>
  </div>
);

const ProposalDemo = ({ t, override, onPick }: { t: number; override: View | null; onPick: (v: View) => void }) => {
  const phase: Phase = override ?? phaseAt(t);
  const showLink = phase === "link";
  const showEmail = phase === "email" || phase === "toLink";

  // Manual typing, then backspacing everything
  let manualChars = 0;
  if (phase === "typing") manualChars = Math.floor((t / TYPE_END) * MANUAL_TEXT.length);
  if (phase === "deleting") manualChars = Math.floor((1 - (t - TYPE_END) / (DELETE_END - TYPE_END)) * MANUAL_TEXT.length);
  const manualShown = MANUAL_TEXT.slice(0, manualChars);
  const hotelAt = MANUAL_TEXT.indexOf("1.");
  const copyingHotel = phase === "typing" && manualChars > hotelAt - 4 && manualChars < hotelAt + 6;

  const manualSeconds = (Math.min(t, TYPE_END) / 1000) * 90;
  const filledLines = override === "email" ? AUTO_LINES.length : showEmail ? Math.min(AUTO_LINES.length, Math.floor(((t - EMAIL_CLICK) / (FILL_END - EMAIL_CLICK)) * AUTO_LINES.length) + 1) : 0;

  const pressed = (at: number) => !override && t >= at - 250 && t < at + 150;
  const cursorTarget = phase === "toEmail" ? "email" : phase === "toLink" ? "link" : null;

  return (
    <div className="relative rounded-3xl border border-border bg-background overflow-hidden shadow-card">
      {/* window chrome: email compose, or a browser for the client page */}
      <div className="flex items-center justify-between gap-3 px-5 h-11 border-b border-border bg-subtle">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-border shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-border shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-border shrink-0" />
          {showLink ? (
            <span className="ml-3 flex items-center gap-1.5 h-6 px-2.5 rounded-md bg-background border border-border text-[11px] text-muted-foreground truncate">
              <Lock className="w-3 h-3 shrink-0" /> {SITE.domain}/p/7f3a-berlin
            </span>
          ) : (
            <span className="ml-3 text-[12px] font-medium text-muted-foreground truncate">New message · Your hotel options</span>
          )}
        </div>
        {showLink ? (
          <span className="shrink-0 text-[12px] font-semibold text-success-text">✓ Link ready to share</span>
        ) : showEmail ? (
          <span className="shrink-0 text-[12px] font-semibold text-success-text">✓ Filled in 2 seconds</span>
        ) : (
          <span className="shrink-0 text-[12px] font-semibold tabular text-destructive">⏱ {fmtTime(manualSeconds)}</span>
        )}
      </div>

      {/* body */}
      <div className={`px-5 sm:px-7 py-5 h-[460px] sm:h-[480px] overflow-hidden transition-colors duration-300 ${showLink ? "bg-[#FAFBFA]" : "bg-background"}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={showLink ? "link" : showEmail ? "email" : "manual"}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
        {showLink ? (
          <ClientDigest />
        ) : showEmail ? (
          <div className="text-[13px] sm:text-[14px] leading-[1.55]">
            {AUTO_LINES.slice(0, filledLines).map((line, i) => (
              <motion.div
                key={i}
                initial={override ? false : { opacity: 0, backgroundColor: "rgba(31,186,94,0.18)" }}
                animate={{ opacity: 1, backgroundColor: "rgba(31,186,94,0)" }}
                transition={{ duration: 0.9 }}
                className="whitespace-pre-wrap rounded min-h-[1.55em]"
              >
                {line}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-[13px] sm:text-[14px] leading-[1.55] text-foreground/80">
            {manualShown}
            <span className="inline-block w-[2px] h-4 bg-foreground align-middle ml-0.5 animate-pulse" />
          </div>
        )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Product action bar */}
      <div className="relative flex flex-wrap items-center gap-2 px-5 sm:px-7 py-4 border-t border-border bg-subtle">
        {ACTIONS.map(({ icon: Icon, label }) => {
          const view: View | null = label === "Email" ? "email" : label === "Link" ? "link" : null;
          const active = (view === "email" && showEmail) || (view === "link" && showLink);
          const isPressed = (view === "email" && pressed(EMAIL_CLICK)) || (view === "link" && pressed(LINK_CLICK));
          const Tag = view ? motion.button : motion.span;
          return (
            <Tag
              key={label}
              {...(view ? { type: "button" as const, onClick: () => onPick(view) } : {})}
              animate={{ scale: isPressed ? 0.94 : 1 }}
              className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-[13px] font-semibold transition-colors ${
                active ? "bg-foreground text-background" : "bg-background border border-border text-foreground"
              } ${view ? "cursor-pointer hover:border-foreground/40" : ""}`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </Tag>
          );
        })}
        <span className="hidden sm:inline ml-auto text-[12px] text-muted-foreground">Try it: click Email or Link</span>

        {/* mouse cursor travelling to the next button */}
        <AnimatePresence>
          {cursorTarget && !override && (
            <motion.span
              key={cursorTarget}
              initial={{ opacity: 0, x: cursorTarget === "email" ? 240 : 118, y: cursorTarget === "email" ? -60 : 6 }}
              animate={{ opacity: 1, x: cursorTarget === "email" ? 118 : 204, y: 6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: (CURSOR_MS - 80) / 1000, ease: [0.2, 0, 0, 1] }}
              className="absolute left-5 sm:left-7 top-4 pointer-events-none"
            >
              <MousePointer2 className="w-5 h-5 fill-foreground text-background drop-shadow" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* clipboard toast while copying the hotel by hand */}
      <AnimatePresence>
        {copyingHotel && !override && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-16 right-5 flex items-center gap-2 rounded-xl bg-foreground text-background px-3.5 py-2.5 text-[12px] shadow-float"
          >
            <Clipboard className="w-3.5 h-3.5 shrink-0" />
            Copied hotel from <span className="font-semibold">Supplier A</span> tab
            <span className="text-background/50">⌘C → ⌘V</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const points = ["Hotel, dates, room and price filled in for you", "Send as email, link or PDF", "See the moment your client chooses"];

const ProposalsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const still = useReducedMotion() ?? false;
  // A click on Email or Link pauses the autoplay and shows that view
  const [override, setOverride] = useState<View | null>(null);
  const [clock, resetClock] = useLoopClock(inView && !still && !override);
  const effectiveOverride: View | null = override ?? (still ? "link" : null);
  const caption = CAPTIONS[effectiveOverride ?? phaseAt(clock)];

  return (
    <section id="proposals" className="py-28 lg:py-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="03"
          label="Proposals"
          title={
            <>
              Proposals that <span className="text-primary">write themselves.</span>
            </>
          }
          desc={`Stop copying hotel names, dates and prices into emails. Pick the hotels and ${SITE.name} fills in the whole proposal, ready to send as an email or a link.`}
        />

        <div ref={ref} className="max-w-4xl mx-auto">
          <div className="h-8 mb-3 flex items-center justify-between gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={caption.text}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className={`flex items-center gap-2 text-[15px] font-semibold ${caption.tone === "good" ? "text-foreground" : "text-muted-foreground"}`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    caption.tone === "good" ? "bg-primary" : caption.tone === "bad" ? "bg-destructive/70" : "bg-foreground/30"
                  }`}
                />
                {caption.text}
              </motion.div>
            </AnimatePresence>
            {override && (
              <button
                type="button"
                onClick={() => {
                  resetClock();
                  setOverride(null);
                }} className="shrink-0 text-[13px] font-semibold text-muted-foreground hover:text-foreground">
                ↺ Replay
              </button>
            )}
          </div>

          <ProposalDemo t={clock} override={effectiveOverride} onPick={setOverride} />

          <ul className="flex flex-wrap gap-x-8 gap-y-3 mt-8">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-2 text-[15px] font-medium">
                <Check className="w-4 h-4 text-primary shrink-0" strokeWidth={2.5} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProposalsSection;
