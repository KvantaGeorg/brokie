import { CalendarCheck, Palette, Users } from "lucide-react";
import { Blobs, FadeUp } from "./product/ProductUI";

const points = [
  { icon: Palette, title: "White-label", desc: "Your colours, your app. Brokie's mascot and game layer plug into your mobile banking." },
  { icon: CalendarCheck, title: "Daily engagement", desc: "Streaks and challenges give 18–25 year olds a reason to open the bank app every day." },
  { icon: Users, title: "Customers for life", desc: "Help students build good habits now, and they grow up with your bank." },
];

const BanksSection = () => (
  <section id="banks" className="relative py-24 lg:py-32 bg-subtle">
    <Blobs variant={0} />
    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-strong rounded-[32px] p-7 sm:p-10 lg:p-14 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
        <div>
          <p className="micro-label mb-4">For banks</p>
          <h2 className="leading-[1.08]" style={{ fontSize: "clamp(28px, 3.6vw, 42px)" }}>
            Young customers open TikTok every day. Make your app the next habit.
          </h2>
          <p className="text-muted-foreground text-[17px] font-semibold mt-4">
            Banks can white-label Brokie to engage young customers every day, with real spending data they already have.
          </p>
        </div>
        <ul className="grid sm:grid-cols-3 lg:grid-cols-1 gap-3">
          {points.map(({ icon: Icon, title, desc }, i) => (
            <li key={title}>
              <FadeUp delay={i * 0.06} className="flex gap-4 items-start rounded-2xl bg-white/[0.05] border border-white/10 p-5 h-full">
                <span className="shrink-0 w-11 h-11 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shadow-[0_3px_0_hsl(var(--accent-deep))]">
                  <Icon className="w-5 h-5" strokeWidth={2.5} />
                </span>
                <span>
                  <span className="block text-[17px] font-black">{title}</span>
                  <span className="block text-[15px] text-muted-foreground font-semibold leading-snug mt-0.5">{desc}</span>
                </span>
              </FadeUp>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default BanksSection;
