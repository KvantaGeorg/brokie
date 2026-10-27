import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { SectionHeader } from "./product/ProductUI";
import BrokieMascot from "./brand/BrokieMascot";
import { CATEGORY_ICONS } from "./product/phone/icons";
import { TRANSACTIONS, spendingByCategory, totalIncome, totalSpent, type SpendCategory } from "@/data/transactions";
import { categoryInsight } from "@/data/insights";

const eur = (n: number) => `€${n.toFixed(2)}`;

const SpendingSection = () => {
  const data = useMemo(() => [...spendingByCategory()].sort((a, b) => b.total - a.total), []);
  const spent = totalSpent();
  const income = totalIncome();
  const [selected, setSelected] = useState<SpendCategory>("delivery");
  const sel = data.find((d) => d.id === selected)!;
  const insight = categoryInsight(sel.id);
  const Icon = CATEGORY_ICONS[sel.id];

  return (
    <section id="features" className="section section-alt">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader label="Spending insights" title="Your spending, decoded." desc="Sometimes the biggest surprise isn't what you bought. It's how often you bought it." />

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">
          {/* Donut */}
          <div className="relative mx-auto w-full max-w-[400px] aspect-square">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="total"
                  nameKey="label"
                  innerRadius="64%"
                  outerRadius="92%"
                  paddingAngle={1.5}
                  cornerRadius={6}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                  isAnimationActive={false}
                  onClick={(_, i) => setSelected(data[i].id)}
                >
                  {data.map((d) => (
                    <Cell key={d.id} fill={d.color} opacity={d.id === selected ? 1 : 0.3} className="cursor-pointer outline-none transition-opacity" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[13px] font-extrabold text-muted-foreground">October spending</span>
              <span className="text-[34px] font-black tabular leading-tight">{eur(spent)}</span>
              <span className="text-[13px] font-bold text-muted-foreground tabular">
                of {eur(income)} · {eur(income - spent)} left
              </span>
            </div>
          </div>

          <div>
            {/* Category list: the accessible way to drive the chart */}
            <div role="radiogroup" aria-label="Spending categories" className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {data.map((d) => {
                const on = d.id === selected;
                return (
                  <button
                    key={d.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setSelected(d.id)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[14px] font-extrabold border transition-colors ${on ? "border-white/30 bg-white/[0.06]" : "border-white/[0.08] text-foreground/75 hover:text-foreground"}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="flex-1 truncate">{d.label}</span>
                    <span className="tabular text-muted-foreground">€{Math.round(d.total)}</span>
                  </button>
                );
              })}
            </div>

            <div className="surface rounded-3xl p-6 sm:p-7 mt-5" aria-live="polite">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${sel.color} 18%, transparent)`, color: sel.color }}>
                  <Icon className="w-5 h-5" strokeWidth={2.25} aria-hidden="true" />
                </span>
                <h3 className="text-[22px] flex-1">{sel.label}</h3>
              </div>
              <dl className="grid grid-cols-2 gap-4 mt-5">
                <div>
                  <dt className="text-[13px] font-bold text-muted-foreground">Total spent</dt>
                  <dd className="text-[26px] font-black tabular">{eur(sel.total)}</dd>
                </div>
                <div>
                  <dt className="text-[13px] font-bold text-muted-foreground">Share of spending</dt>
                  <dd className="text-[26px] font-black tabular">{insight.share}%</dd>
                </div>
              </dl>
              <div className="flex items-start gap-3 mt-5 pt-5 border-t border-white/[0.08]">
                <BrokieMascot mood={insight.mood} size={40} className="shrink-0" title="" />
                <p className="text-[16px] font-bold leading-snug">{insight.text}</p>
              </div>
            </div>

            <p className="text-[13px] font-semibold text-muted-foreground mt-4">
              Illustrative data: one student in Vilnius, October, {TRANSACTIONS.length} mock transactions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpendingSection;
