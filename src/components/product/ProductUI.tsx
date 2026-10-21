import { motion } from "framer-motion";
import { Calendar, Check, ChevronRight, Flag, Footprints, Hotel, Search, ShoppingBasket, TriangleAlert, User } from "lucide-react";
import { createContext, useContext, type ReactNode } from "react";

/* Product-styled building blocks that mirror the app UI. */

export type Supplier = { name: string; initial: string; bg: string; fg: string };

export const SUPPLIERS: Supplier[] = [
  { name: "Supplier A", initial: "A", bg: "#111111", fg: "#FFFFFF" },
  { name: "Supplier B", initial: "B", bg: "#E7F9ED", fg: "#15803D" },
  { name: "Supplier C", initial: "C", bg: "#EEEEEE", fg: "#555555" },
  { name: "Supplier D", initial: "D", bg: "#DDE3E6", fg: "#334155" },
];

export const SupplierLogo = ({ s, size = 20, status }: { s: Supplier; size?: number; status?: "ok" | "error" }) => (
  <span className="relative inline-flex shrink-0">
    <span
      className="inline-flex items-center justify-center rounded-full font-bold"
      style={{ width: size, height: size, background: s.bg, color: s.fg, fontSize: size * 0.45 }}
    >
      {s.initial}
    </span>
    {status && (
      <span
        className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-background ${
          status === "ok" ? "bg-primary" : "bg-destructive"
        }`}
      />
    )}
  </span>
);

export const SupplierRow = ({ errorIdx }: { errorIdx?: number }) => (
  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
    {SUPPLIERS.map((s, i) => (
      <span key={s.name} className="inline-flex items-center gap-2 text-sm">
        <SupplierLogo s={s} size={18} />
        <span className={i === errorIdx ? "text-destructive" : "text-foreground"}>{s.name}</span>
        {i === errorIdx ? (
          <TriangleAlert className="w-3.5 h-3.5 text-destructive" />
        ) : (
          <Check className="w-3.5 h-3.5 text-success-text" />
        )}
      </span>
    ))}
  </div>
);

export const PillToggle = ({ options, active = 0, size = "md" }: { options: string[]; active?: number; size?: "sm" | "md" }) => (
  <div className="inline-flex items-center rounded-full border border-border bg-background p-0.5">
    {options.map((o, i) => (
      <span
        key={o}
        className={`rounded-full font-medium whitespace-nowrap ${size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-[13px]"} ${
          i === active ? "bg-foreground text-background" : "text-foreground"
        }`}
      >
        {o}
      </span>
    ))}
  </div>
);

const Field = ({ icon, label, value, className = "" }: { icon: ReactNode; label: string; value: string; className?: string }) => (
  <div className={`flex items-center gap-3 px-4 py-3 min-w-0 ${className}`}>
    <span className="text-muted-foreground shrink-0">{icon}</span>
    <div className="min-w-0">
      <div className="text-[11px] text-muted-foreground leading-tight">{label}</div>
      <div className="text-[14px] font-semibold text-foreground truncate leading-snug">{value}</div>
    </div>
  </div>
);

export const SearchBarMock = () => (
  <div className="w-full">
    <div className="flex items-center justify-between gap-3 mb-3">
      <PillToggle options={["Near a venue or address", "City or hotel"]} />
      <div className="hidden sm:flex items-center gap-1.5">
        {SUPPLIERS.map((s, i) => (
          <SupplierLogo key={s.name} s={s} size={20} status={i === 2 ? "error" : "ok"} />
        ))}
        <span className="ml-1.5 text-[13px] font-semibold text-success-text">Manage</span>
      </div>
    </div>
    <div className="flex flex-col md:flex-row md:items-center bg-background border border-border rounded-2xl shadow-card p-1.5">
      <Field className="md:flex-[1.3]" icon={<Flag className="w-4 h-4" />} label="Venue or address" value="Pinned location · Berlin" />
      <span className="hidden md:block w-px h-9 bg-border" />
      <Field className="md:flex-1" icon={<Calendar className="w-4 h-4" />} label="Dates" value="Thu 8 Oct – Sat 10 Oct" />
      <span className="hidden md:block w-px h-9 bg-border" />
      <Field className="md:flex-1" icon={<User className="w-4 h-4" />} label="Guests" value="2 adults · 1 room" />
      <span className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-foreground text-background text-[15px] font-semibold mt-1 md:mt-0">
        <Search className="w-4 h-4" /> Search
      </span>
    </div>
  </div>
);

/* Example hotel photos (Unsplash, free to use under the Unsplash License). */
export const HOTEL_PHOTOS = {
  roomWhite: "photo-1618773928121-c32242e63f39",
  roomGarden: "photo-1611892440504-42a792e24d32",
  roomSimple: "photo-1631049307264-da0ec9d70304",
};

export const PhotoTile = ({ tone = 0, className = "", photo }: { tone?: number; className?: string; photo?: string }) => {
  const tones = ["#E9E4DC", "#DDE3E6", "#E6E1E8", "#E2E7DF"];
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`} style={{ background: tones[tone % tones.length] }}>
      {photo ? (
        <img
          src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=800&q=70`}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <Hotel className="w-7 h-7 text-foreground/20" strokeWidth={1.5} />
      )}
    </div>
  );
};

export type HotelRate = { supplier: number; price: number };

export const Stars = ({ n }: { n: number }) => (
  <span className="text-star text-[12px] tracking-[0.1em]">{"★".repeat(n)}</span>
);

export const HotelCardMock = ({
  name,
  address,
  walk,
  stars,
  rates,
  nights = "2 nights, 2 adults",
  tone = 0,
  photo,
}: {
  name: string;
  address: string;
  walk: string;
  stars: number;
  rates: HotelRate[];
  nights?: string;
  tone?: number;
  photo?: string;
}) => {
  const best = Math.min(...rates.map((r) => r.price));
  return (
    <div className="grid grid-cols-[96px_1fr] sm:grid-cols-[150px_1fr_190px] bg-background border border-border rounded-2xl overflow-hidden">
      <PhotoTile tone={tone} photo={photo} className="row-span-2 sm:row-span-1 min-h-[120px]" />
      <div className="p-4 min-w-0">
        <Stars n={stars} />
        <div className="text-[16px] font-bold text-foreground leading-snug mt-0.5">{name}</div>
        <div className="text-[13px] text-muted-foreground mt-0.5 truncate">
          {address} · <span className="text-success-text">View on map</span>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] text-success-text mt-2">
          <Footprints className="w-3.5 h-3.5" /> {walk}
        </div>
      </div>
      <div className="col-span-2 sm:col-span-1 bg-subtle sm:border-l border-t sm:border-t-0 border-border p-4 flex flex-col">
        <div className="text-[12px] text-muted-foreground">{nights}</div>
        <div className="text-[24px] font-bold text-foreground leading-tight tabular">€{best}</div>
        <div className="space-y-1 mt-2 mb-3">
          {rates.map((r) => (
            <div key={r.supplier} className="flex items-center justify-between text-[12px]">
              <span className="inline-flex items-center gap-1.5 text-foreground">
                <SupplierLogo s={SUPPLIERS[r.supplier]} size={14} />
                {SUPPLIERS[r.supplier].name}
              </span>
              <span
                className={`tabular font-semibold ${
                  r.price === best ? "bg-success-soft text-success-text rounded-full px-1.5" : "text-foreground"
                }`}
              >
                €{r.price}
              </span>
            </div>
          ))}
        </div>
        <span className="mt-auto inline-flex items-center justify-center h-9 rounded-lg bg-foreground text-background text-[13px] font-semibold">
          View rates
        </span>
      </div>
    </div>
  );
};

export const ProgressStrip = ({ answered, total = 4 }: { answered: number; total?: number }) => (
  <div className="rounded-xl border border-border bg-background px-4 py-3">
    <div className="flex items-center justify-between text-[13px]">
      <span className="inline-flex items-center gap-2 text-foreground">
        <span className={`w-3.5 h-3.5 rounded-full border-2 border-primary ${answered < total ? "border-t-transparent animate-spin" : ""}`} />
        {answered < total ? "Searching suppliers…" : "All suppliers answered"}
        <span className="text-muted-foreground tabular">
          {answered} of {total} answered
        </span>
      </span>
      <span className="text-[12px] text-muted-foreground">{answered < total ? "Cancel" : "Done"}</span>
    </div>
    <div className="mt-2.5 h-[3px] rounded-full bg-border overflow-hidden">
      <motion.div
        className="h-full bg-primary rounded-full"
        animate={{ width: `${(answered / total) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  </div>
);

export const ProposalBar = ({ className = "", compact = false }: { className?: string; compact?: boolean }) => (
  <div className={`inline-flex items-center gap-3 sm:gap-5 rounded-2xl bg-foreground text-background pl-4 pr-2 py-2 shadow-float ${className}`}>
    <ShoppingBasket className="w-4 h-4 shrink-0 text-primary" />
    <div className="min-w-0">
      <div className="text-[13px] font-semibold leading-tight whitespace-nowrap">Proposal #5</div>
      <div className="text-[11px] text-background/60 whitespace-nowrap tabular">3 options<span className={compact ? "hidden" : "hidden sm:inline"}> · 3 hotels · €63.80–€591.80</span></div>
    </div>
    <span className={`${compact ? "hidden" : "hidden sm:inline-flex"} items-center h-8 px-3 rounded-lg border border-background/25 text-[12px] font-semibold whitespace-nowrap`}>
      Review picks
    </span>
    <span className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold whitespace-nowrap">
      Open proposal <ChevronRight className="w-3.5 h-3.5" />
    </span>
  </div>
);

/* Section numbers ("01 — The problem") make sense on the one-page home, not on standalone pages. */
export const SectionIndexContext = createContext(true);

export const SectionHeader = ({ label, title, desc, center = false, index }: { label: string; title: ReactNode; desc?: string; center?: boolean; index?: string }) => {
  const showIndex = useContext(SectionIndexContext);
  return (
  <div className={`max-w-2xl mb-12 ${center ? "mx-auto text-center" : ""}`}>
    <p className={`micro-label mb-4 flex items-center gap-3 ${center ? "justify-center" : ""}`}>
      {index && showIndex && (
        <>
          <span className="text-foreground tabular">{index}</span>
          <span className="w-8 h-px bg-foreground/20" />
        </>
      )}
      {label}
    </p>
    <h2 className="text-foreground leading-[1.08]" style={{ fontSize: "clamp(30px, 4vw, 44px)" }}>
      {title}
    </h2>
    {desc && <p className="text-muted-foreground text-[17px] mt-4">{desc}</p>}
  </div>
  );
};

export const FadeUp = ({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.45, delay, ease: [0.2, 0, 0, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);
