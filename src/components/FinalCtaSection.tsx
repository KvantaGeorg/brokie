import { Link } from "react-router-dom";
import BrokieMascot from "./brand/BrokieMascot";
import { SITE } from "@/config/site";

const FinalCtaSection = () => (
  <section className="section">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <BrokieMascot mood="happy" size={88} className="mx-auto" title="" />
      <h2 className="mt-6 leading-[1.05]" style={{ fontSize: "clamp(36px, 5.4vw, 64px)" }}>
        Ready to level up <span className="text-accent">out of broke?</span>
      </h2>
      <p className="text-[18px] font-semibold text-muted-foreground mt-5">Understand your spending. Build your budget. Start working toward your goals.</p>
      <Link to={SITE.demoPath} className="btn btn-accent mt-10">
        Try the interactive demo
      </Link>
    </div>
  </section>
);

export default FinalCtaSection;
