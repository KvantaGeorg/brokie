import { Link } from "react-router-dom";
import { ArrowRight, CalendarRange, Receipt, Target } from "lucide-react";
import SourceLink from "./SourceLink";
import { SITE } from "@/config/site";
import { datasetStats } from "@/data/students";

const stats = datasetStats();

/* Each problem comes with a number from the Brokie student dataset. */
const problems = [
  {
    n: "01",
    icon: Receipt,
    title: "Invisible spending",
    desc: "Small purchases feel harmless until you see the monthly total.",
    value: `${stats.coffeePerMonth}`,
    fact: "coffees a month for the average student in our data",
  },
  {
    n: "02",
    icon: CalendarRange,
    title: "Budgeting that doesn't fit",
    desc: "Scholarships, part-time jobs, and family support don't always follow a regular payday.",
    value: `${stats.overspenders} of ${stats.students}`,
    fact: "students spend more in a month than comes in",
  },
  {
    n: "03",
    icon: Target,
    title: "Goals that never happen",
    desc: "Saving for something is harder when you don't know how much you can actually put aside.",
    value: `€${stats.byCat.find((c) => c.id === "eatingOut")!.avg}`,
    fact: "a month on eating out and coffee, second only to rent",
  },
];

const ProblemSection = () => (
  <section id="problem" className="section section-alt">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h2 className="leading-[1.05]" style={{ fontSize: "clamp(34px, 4.8vw, 56px)" }}>
          Where did all my money go?
        </h2>
        <p className="text-muted-foreground text-[18px] font-semibold leading-relaxed mt-5 max-w-2xl">
          We looked at {stats.students} students from {stats.universities} universities in Vilnius and Kaunas: {stats.transactions.toLocaleString("en-GB")} transactions over three months. The same data runs our demo.
        </p>
      </div>

      <ol className="grid md:grid-cols-3 gap-10 md:gap-8 mt-16">
        {problems.map(({ n, icon: Icon, title, desc, value, fact }) => (
          <li key={n} className="border-t border-white/10 pt-6 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-black text-primary-glow tabular">{n}</span>
              <Icon className="w-6 h-6 text-foreground/70" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <h3 className="text-[22px] mt-5">{title}</h3>
            <p className="text-[16px] text-muted-foreground font-semibold leading-relaxed mt-2">{desc}</p>
            <p className="mt-6">
              <span className="block text-[36px] font-black leading-none tabular">{value}</span>
              <span className="block text-[14px] font-semibold text-muted-foreground mt-1.5">{fact}</span>
            </p>
          </li>
        ))}
      </ol>

      {/* outside research, and where our data comes from */}
      <div className="mt-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <aside aria-label="Research" className="flex flex-col sm:flex-row gap-6 sm:gap-12 text-[14px]">
          {SITE.stats.map((s) => (
            <p key={s.value} className="max-w-xs">
              <span className="text-[20px] font-black text-foreground mr-1.5">{s.value}</span>
              <span className="font-semibold text-muted-foreground">{s.text}.</span> <SourceLink id={s.source} />
            </p>
          ))}
        </aside>
        <Link to={SITE.demoPath} className="inline-flex items-center gap-1.5 text-[15px] font-extrabold text-primary-glow hover:text-foreground shrink-0">
          Open the demo as any of the {stats.students} students <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
      <p className="text-[12.5px] font-semibold text-muted-foreground mt-8 max-w-3xl">
        Our dataset is built from public sources: spending patterns from a Kaggle personal budget dataset, student incomes from Swedbank's student finance survey, youth statistics from Eurostat, and Lithuanian dorm and student subscription prices. Students are anonymised.
      </p>
    </div>
  </section>
);

export default ProblemSection;
