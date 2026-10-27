import { Clock, Flame, GraduationCap, MessageCircle, Zap, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { SectionHeader } from "./product/ProductUI";
import { ProgressBar } from "./product/GameUI";
import BrokieMascot from "./brand/BrokieMascot";
import ToneToggle from "./ToneToggle";
import { EXAMPLES } from "@/data/notifications";
import { PROFILE, levelTitle, levelXp } from "@/data/challenges";
import { LESSON_XP, lessonsFor } from "@/data/lessons";
import { FEATURED_ID, catMeta, modelFor } from "@/data/students";
import { useTone } from "@/hooks/use-tone";

const featured = modelFor(FEATURED_ID);
const focusLabel = catMeta(featured.focus).label.toLowerCase();
const focusLimit = featured.suggested[featured.focus];
const focusSpent = featured.current.byCategory(featured.focus);
const lessons = lessonsFor(featured, null);

const Card = ({ icon: Icon, title, desc, children, aside }: { icon: LucideIcon; title: string; desc: string; children: ReactNode; aside?: ReactNode }) => (
  <li className="surface rounded-3xl p-6 flex flex-col">
    <div className="flex items-start justify-between gap-3">
      <span className="w-11 h-11 shrink-0 rounded-xl bg-primary/15 text-primary-glow flex items-center justify-center">
        <Icon className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
      </span>
      {aside}
    </div>
    <h3 className="text-[22px] mt-5">{title}</h3>
    <p className="text-[15px] font-semibold text-muted-foreground mt-1.5 leading-relaxed">{desc}</p>
    <div className="mt-6 flex-1 flex flex-col justify-end">{children}</div>
  </li>
);

/* What keeps students coming back: challenges and XP, Brokie's voice, and short lessons. */
const FeaturesSection = () => {
  const { tone } = useTone();
  return (
    <section id="features" className="section section-alt">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader label="Features" title="Small wins that keep you going." desc="A budget only works if you come back to it. Brokie turns it into challenges, talks to you like a friend, and teaches the basics along the way." />

        <ul className="grid lg:grid-cols-3 gap-6">
          <Card icon={Zap} title="Challenges and XP" desc="Challenges built from your own spending. Finish one, earn XP, level up.">
            <div className="rounded-2xl border border-white/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[14.5px] font-extrabold leading-snug">
                  Stay under €{focusLimit} on {focusLabel} this month
                </p>
                <span className="text-[12.5px] font-black text-accent shrink-0">+50 XP</span>
              </div>
              <ProgressBar value={Math.min(focusSpent, focusLimit)} max={focusLimit} label={`${focusLabel} budget used`} className="mt-3 h-2" />
              <p className="text-[12.5px] font-bold text-muted-foreground mt-2 tabular">
                €{Math.round(focusSpent)} of €{focusLimit} used · 16 days left
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-[13.5px] font-extrabold">
              <span>
                Level {PROFILE.level} · {levelTitle(PROFILE.level)}
              </span>
              <span className="inline-flex items-center gap-1 text-chart-6">
                <Flame className="w-4 h-4" aria-hidden="true" /> {PROFILE.streak}
                <span className="sr-only">day streak</span>
              </span>
            </div>
            <ProgressBar value={PROFILE.xp} max={levelXp(PROFILE.level)} label={`XP towards level ${PROFILE.level + 1}`} className="mt-3 h-2" />
          </Card>

          <Card icon={MessageCircle} title="A sidekick with a voice" desc="Brokie cheers your progress and questions that 2 AM order. Pick how honest it gets." aside={<ToneToggle />}>
            <ul className="space-y-3" aria-live="polite">
              {EXAMPLES.slice(0, 2).map((n) => (
                <li key={n.id} className="rounded-2xl bg-[hsl(258_30%_20%)] border border-white/10 p-3.5 flex gap-3 items-start">
                  <BrokieMascot mood={n.mood} size={30} className="shrink-0" title="" />
                  <span className="min-w-0">
                    <span className="flex justify-between text-[11.5px] font-extrabold text-white/55">
                      <span>Brokie</span>
                      <span>{n.time}</span>
                    </span>
                    <span className="block text-[14px] font-bold leading-snug mt-0.5">{n.text[tone]}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card icon={GraduationCap} title="Money basics, in two minutes" desc="Short lessons with your own numbers and one question at the end. No lectures, no advice to buy anything.">
            <ol className="divide-y divide-white/[0.07]">
              {lessons.map((l, i) => (
                <li key={l.id} className="flex items-center gap-3 py-2 text-[14px] font-bold">
                  <span className="w-5 text-[12px] font-black text-primary-glow tabular">{i + 1}</span>
                  <span className="flex-1">{l.title}</span>
                  <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground shrink-0">
                    <Clock className="w-3 h-3" aria-hidden="true" /> {l.minutes} min
                  </span>
                </li>
              ))}
            </ol>
            <p className="text-[12.5px] font-bold text-muted-foreground mt-2">+{LESSON_XP} XP for each right answer.</p>
          </Card>
        </ul>
      </div>
    </section>
  );
};

export default FeaturesSection;
