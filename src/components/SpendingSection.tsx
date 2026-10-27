import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Blobs, SectionHeader } from "./product/ProductUI";
import BrokieMascot from "./brand/BrokieMascot";
import { spendingByCategory, totalIncome, totalSpent, type SpendCategory } from "@/data/transactions";
import { categoryInsight } from "@/data/insights";

const eur = (n: number) => `€${n.toFixed(2)}`;

const SpendingSection = () => {
  const data = useMemo(() => spendingByCategory(), []);
  const spent = totalSpent();
  const income = totalIncome();
  const [selected, setSelected] = useState<SpendCategory>("delivery");
  const sel = data.find((d) => d.id === selected)!;
  const insight = categoryInsight(sel.id);
  const share = insight.share;

  return (
    <section id="spending" className="relative py-24 lg:py-36">
      <Blobs variant={0} />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Spending structure"
          title="One student, one month in Vilnius."
          desc="This is a demo month of 40 mock transactions. Pick a category to see what Brokie notices."
        />

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Donut */}
          <div className="relative mx-auto w-full max-w-[420px] aspect-square">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="total"
                  nameKey="label"
                  innerRadius="58%"
                  outerRadius="92%"
                  paddingAngle={2}
                  cornerRadius={8}
                  stroke="none"
                  isAnimationActive
                  onClick={(_, i) => setSelected(data[i].id)}
                >
                  {data.map((d) => (
                    <Cell
                      key={d.id}
                      fill={d.color}
                      opacity={d.id === selected ? 1 : 0.38}
                      className="cursor-pointer outline-none transition-opacity"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[13px] font-extrabold text-muted-foreground">Spent in October</span>
              <span className="text-[38px] font-black tabular leading-tight">€{spent.toFixed(0)}</span>
              <span className="text-[13px] font-bold text-muted-foreground">
                of €{income.toFixed(0)} in · <span className="text-accent">€{(income - spent).toFixed(2)} left</span>
              </span>
            </div>
          </div>

          <div>
            {/* Category picker: the accessible way to drive the chart */}
            <div role="group" aria-label="Spending categories" className="flex flex-wrap gap-2 mb-6">
              {data.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={d.id === selected}
                  onClick={() => setSelected(d.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[14px] font-extrabold border transition-all hover:-translate-y-0.5 ${
                    d.id === selected ? "bg-white/15 border-white/40" : "bg-white/[0.04] border-white/10 text-foreground/80"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  {d.label}
                  <span className="tabular text-muted-foreground">€{d.total.toFixed(0)}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="glass-strong rounded-3xl p-6 sm:p-7"
                aria-live="polite"
              >
                <div className="flex items-start gap-4">
                  <BrokieMascot mood={insight.mood} size={64} className="shrink-0" title="" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <h3 className="text-[22px]">
                        {sel.emoji} {sel.label}
                      </h3>
                      <span className="text-[15px] font-extrabold text-muted-foreground tabular">
                        {eur(sel.total)} · {share}% · {sel.count} payments
                      </span>
                    </div>
                    <p className="text-[17px] font-bold leading-snug mt-2">{insight.text}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpendingSection;
