import { ArrowDownLeft, ArrowUpRight, Building2, CalendarCheck, Palette, Send } from "lucide-react";
import { SectionHeader } from "./product/ProductUI";
import { ProgressBar } from "./product/GameUI";
import BrokieMascot from "./brand/BrokieMascot";

const benefits = [
  { icon: Palette, title: "White-label experience", desc: "Adapt Brokie's financial insights, budgeting, goals, and gamification to a bank's brand." },
  { icon: CalendarCheck, title: "Everyday engagement", desc: "Give younger customers useful reasons to return to their banking app." },
  { icon: Building2, title: "Long-term relationships", desc: "Help banks build stronger relationships with students as their financial needs evolve." },
];

/* A generic, unbranded banking app with a Brokie module inside it. */
const BankMock = () => (
  <div className="mx-auto w-full max-w-[360px] rounded-[28px] border border-white/10 bg-[hsl(230_25%_12%)] p-5" aria-hidden="true">
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-[13px] font-extrabold text-white/70">
        <span className="w-6 h-6 rounded-md bg-white/15" /> Your Bank
      </span>
      <span className="w-7 h-7 rounded-full bg-white/10" />
    </div>
    <p className="text-[12px] font-bold text-white/50 mt-5">Current account</p>
    <p className="text-[28px] font-black tabular">€236.68</p>
    <div className="grid grid-cols-3 gap-2 mt-4">
      {[
        { icon: Send, label: "Pay" },
        { icon: ArrowDownLeft, label: "Request" },
        { icon: ArrowUpRight, label: "Transfer" },
      ].map(({ icon: Icon, label }) => (
        <span key={label} className="flex flex-col items-center gap-1 rounded-xl bg-white/[0.06] py-2.5 text-[11px] font-bold text-white/70">
          <Icon className="w-4 h-4" />
          {label}
        </span>
      ))}
    </div>

    <div className="mt-4 rounded-2xl bg-[hsl(258_42%_12%)] border border-primary/40 p-4">
      <div className="flex items-center gap-2.5">
        <BrokieMascot mood="happy" size={30} title="" />
        <span className="text-[13px] font-black">Brokie</span>
        <span className="ml-auto rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-black">Lv 7</span>
      </div>
      <p className="text-[13px] font-bold mt-3">€12 left in your delivery budget</p>
      <ProgressBar value={43} max={55} label="Delivery budget used" className="mt-2 h-2" />
      <p className="text-[12px] font-bold text-white/55 mt-3">Trip to Riga · €45 of €150</p>
    </div>

    <div className="mt-4 space-y-2.5">
      {["Maxima", "Bolt ride"].map((m, i) => (
        <div key={m} className="flex justify-between text-[12px] font-bold text-white/60">
          <span>{m}</span>
          <span className="tabular">{i ? "−€8.60" : "−€24.60"}</span>
        </div>
      ))}
    </div>
  </div>
);

const BanksSection = () => (
  <section id="banks" className="section section-alt">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
      <div>
        <SectionHeader
          label="For banks"
          title="Make everyday banking more engaging."
          desc="Brokie is designed as a white-label financial engagement experience that banks could integrate into their existing mobile apps."
        />
        <ul className="space-y-6 -mt-2">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex gap-4">
              <Icon className="w-6 h-6 shrink-0 text-primary-glow mt-0.5" strokeWidth={1.75} aria-hidden="true" />
              <div>
                <h3 className="text-[19px]">{title}</h3>
                <p className="text-[16px] font-semibold text-muted-foreground mt-1">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-[14px] font-semibold text-muted-foreground border-l-2 border-white/15 pl-4">
          This is Brokie's proposed B2B business model. There is no existing commercial integration with any bank.
        </p>
      </div>
      <figure>
        <BankMock />
        <figcaption className="text-center text-[13px] font-semibold text-muted-foreground mt-4">Concept: Brokie inside a generic banking app.</figcaption>
      </figure>
    </div>
  </section>
);

export default BanksSection;
