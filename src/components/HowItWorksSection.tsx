import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Calendar, Check, Flag, Search, User } from "lucide-react";
import { HOTEL_PHOTOS, PhotoTile, SectionHeader, Stars, SUPPLIERS, SupplierLogo } from "./product/ProductUI";
import { SITE } from "@/config/site";

const STEP_MS = 5000;

const steps = [
  {
    n: "01",
    title: "Search once",
    desc: `Enter the venue, dates and guests. ${SITE.name} queries every connected supplier at the same time.`,
    outcome: "One form instead of a dozen supplier sites",
  },
  {
    n: "02",
    title: "Compare live rates",
    desc: "See every supplier's price for the same hotel side by side, with the best rate highlighted.",
    outcome: "The best price, without the guesswork",
  },
  {
    n: "03",
    title: "Send & book",
    desc: "Send the client a proposal, then book the option they choose directly with the supplier.",
    outcome: "A faster answer for your client",
  },
];

/* Step visuals: one product card per step */
const SearchVisual = () => (
  <div className="space-y-3">
    {[
      { icon: <Flag className="w-4 h-4" />, label: "Venue or address", value: "Pinned location · Berlin" },
      { icon: <Calendar className="w-4 h-4" />, label: "Dates", value: "Thu 8 Oct – Sat 10 Oct" },
      { icon: <User className="w-4 h-4" />, label: "Guests", value: "2 adults · 1 room" },
    ].map((f) => (
      <div key={f.label} className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
        <span className="text-muted-foreground">{f.icon}</span>
        <div>
          <div className="text-[11px] text-muted-foreground leading-tight">{f.label}</div>
          <div className="text-[15px] font-semibold leading-snug">{f.value}</div>
        </div>
      </div>
    ))}
    <div className="flex items-center justify-center gap-2 h-12 rounded-xl bg-foreground text-background text-[15px] font-semibold">
      <Search className="w-4 h-4" /> Search all suppliers
    </div>
  </div>
);

const compareRows = [
  { s: 3, p: 316 },
  { s: 0, p: 324 },
  { s: 1, p: 374 },
];

const CompareVisual = () => (
  <div>
    <div className="text-[17px] font-bold tracking-[-0.02em]">Spree Garden Hotel</div>
    <div className="text-[13px] text-muted-foreground mb-4">2 nights · 2 adults</div>
    <div className="space-y-2">
      {compareRows.map((r, i) => (
        <div
          key={r.s}
          className={`flex items-center gap-3 rounded-xl px-4 py-3.5 ${i === 0 ? "bg-success-soft" : "bg-background border border-border"}`}
        >
          <SupplierLogo s={SUPPLIERS[r.s]} size={26} />
          <span className="flex-1 text-[15px] font-medium">{SUPPLIERS[r.s].name}</span>
          {i === 0 && <span className="text-[11px] font-semibold text-success-text">Best rate</span>}
          <span className="text-[18px] font-bold tabular">€{r.p}</span>
        </div>
      ))}
    </div>
  </div>
);

const ProposalVisual = () => (
  <div className="relative pb-8">
    <div className="rounded-2xl border border-border bg-background p-4">
      <PhotoTile photo={HOTEL_PHOTOS.roomGarden} tone={1} className="h-32 rounded-xl" />
      <div className="flex items-center justify-between gap-3 mt-3">
        <div className="min-w-0">
          <div className="text-[15px] font-semibold truncate">
            Spree Garden Hotel <Stars n={4} />
          </div>
          <div className="text-[12px] text-success-text">Free cancellation until 5 Oct</div>
        </div>
        <div className="text-[18px] font-bold tabular">€316</div>
      </div>
      <div className="mt-3 flex items-center justify-center h-10 rounded-xl bg-primary text-primary-foreground text-[14px] font-semibold">
        Choose this option
      </div>
    </div>
    <div className="absolute -bottom-1 left-6 right-6 flex items-center gap-3 rounded-2xl bg-foreground text-background p-3.5 shadow-float">
      <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
        <Check className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
      </span>
      <span className="text-[13px] font-semibold">Your client chose Spree Garden Hotel</span>
    </div>
  </div>
);

const visuals = [<SearchVisual key="s" />, <CompareVisual key="c" />, <ProposalVisual key="p" />];

const HowItWorksSection = () => {
  const [active, setActive] = useState(0);
  const still = useReducedMotion() ?? false;

  useEffect(() => {
    if (still) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % steps.length), STEP_MS);
    return () => clearTimeout(t);
  }, [active, still]);

  return (
    <section id="how-it-works" className="py-28 lg:py-40 bg-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader index="02" label="How it works" title="From request to booking in three steps" />

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-20 items-center">
          {/* Step list */}
          <div className="space-y-2">
            {steps.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.n}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative w-full text-left rounded-2xl px-6 py-5 transition-colors ${
                    isActive ? "bg-background shadow-card" : "hover:bg-background/60"
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className={`text-[14px] font-semibold tabular ${isActive ? "text-primary" : "text-muted-foreground"}`}>{s.n}</span>
                    <div className="flex-1">
                      <h3 className={`text-[22px] font-bold tracking-[-0.03em] ${isActive ? "text-foreground" : "text-foreground/45"}`}>{s.title}</h3>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="text-[15px] text-muted-foreground leading-relaxed mt-2">{s.desc}</p>
                            <p className="flex items-center gap-2 mt-4 text-[14px] font-semibold">
                              <Check className="w-4 h-4 text-primary shrink-0" strokeWidth={2.5} />
                              {s.outcome}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  {/* auto-advance progress */}
                  {isActive && !still && (
                    <span className="absolute left-6 right-6 bottom-0 h-[2px] rounded-full bg-border overflow-hidden">
                      <motion.span
                        key={active}
                        className="block h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Visual for the active step */}
          <div className="relative rounded-[28px] bg-background border border-border p-6 sm:p-8 shadow-card min-h-[380px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
                className="w-full"
              >
                {visuals[active]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
