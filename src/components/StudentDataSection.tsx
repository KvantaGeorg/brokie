import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "./product/ProductUI";
import { datasetStats } from "@/data/students";
import { SITE } from "@/config/site";

const stats = datasetStats();
const maxAvg = stats.byCat[0].avg;

/* What the Brokie student dataset shows. The same data runs the demo app. */
const StudentDataSection = () => (
  <section id="data" className="section">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        label="Our data"
        title="40 students. Three months of spending."
        desc={`We built a dataset of ${stats.students} students from ${stats.universities} universities in Vilnius and Kaunas, with ${stats.transactions.toLocaleString("en-GB")} transactions. The demo app runs on it.`}
      />

      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
        {[
          { value: `€${stats.medianIncome}`, text: "median monthly income, from parents, jobs and scholarships" },
          { value: `${stats.overspenders} of ${stats.students}`, text: "spend more in a month than comes in" },
          { value: `${stats.coffeePerMonth}`, text: "coffees a month for the average student" },
          { value: `€${stats.byCat.find((c) => c.id === "eatingOut")!.avg}`, text: "a month on eating out and coffee, second only to rent" },
        ].map((s) => (
          <div key={s.value} className="border-t border-white/10 pt-5">
            <dt className="sr-only">{s.text}</dt>
            <dd>
              <span className="block text-[34px] sm:text-[40px] font-black leading-none tabular">{s.value}</span>
              <span className="block text-[15px] font-semibold text-muted-foreground leading-snug mt-2">{s.text}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 mt-16">
        <figure className="surface rounded-3xl p-6 sm:p-8">
          <figcaption className="text-[15px] font-black">Average monthly spending per student</figcaption>
          <ul className="mt-5 space-y-3">
            {stats.byCat.map((c) => (
              <li key={c.id} className="grid grid-cols-[minmax(0,9.5rem)_1fr_3.5rem] items-center gap-3 text-[14px]">
                <span className="font-bold text-foreground/80 truncate">{c.label}</span>
                <span className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <span className="block h-full rounded-full" style={{ width: `${(c.avg / maxAvg) * 100}%`, background: c.color }} />
                </span>
                <span className="font-black tabular text-right">€{c.avg}</span>
              </li>
            ))}
          </ul>
          <p className="text-[12.5px] font-semibold text-muted-foreground mt-5">Averages over September and October, all 40 students. Rent is €0 for students living with their parents.</p>
        </figure>

        <div className="surface rounded-3xl p-6 sm:p-8 flex flex-col">
          <p className="text-[15px] font-black">What they're saving for</p>
          <ul className="mt-4 divide-y divide-white/[0.07]">
            {stats.goals.slice(0, 6).map(([name, n]) => (
              <li key={name} className="flex justify-between py-2.5 text-[14px] font-bold">
                <span className="text-foreground/85">{name}</span>
                <span className="tabular text-muted-foreground">{n} students</span>
              </li>
            ))}
          </ul>
          <Link to={SITE.demoPath} className="mt-auto pt-6 inline-flex items-center gap-1.5 text-[15px] font-extrabold text-primary-glow hover:text-foreground">
            Open the demo as any of them <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <p className="text-[13px] font-semibold text-muted-foreground mt-8 max-w-3xl">
        Built from public sources: spending patterns from a Kaggle personal budget dataset, student incomes from Swedbank's student finance survey, youth statistics from Eurostat, and Lithuanian dorm and student subscription prices.
        Students are anonymised; names in the demo are made up.
      </p>
    </div>
  </section>
);

export default StudentDataSection;
