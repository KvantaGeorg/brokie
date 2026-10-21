import { Marquee } from "./fx/Motion";

/* Replace with your real partner names or logos */
const suppliers = ["Partner One", "Partner Two", "Partner Three", "Partner Four", "Partner Five", "Partner Six", "Partner Seven"];

const SuppliersLine = () => (
  <section className="pt-16 pb-6">
    <p className="micro-label text-center mb-7">Live rates from 65+ connected suppliers</p>
    <Marquee speed={35}>
      {suppliers.map((s) => (
        <span key={s} className="flex items-center gap-10 pr-10 text-[28px] sm:text-[36px] font-bold tracking-[-0.04em] text-foreground/25 whitespace-nowrap">
          {s}
          <span className="w-2 h-2 rounded-full bg-primary/60" />
        </span>
      ))}
    </Marquee>
  </section>
);

export default SuppliersLine;
