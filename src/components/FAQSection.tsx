import { SITE } from "@/config/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* Placeholder questions: replace with your own. */
const faqs = [
  { q: `What is ${SITE.name}?`, a: `${SITE.name} is ... (one or two sentences about what the product does).` },
  { q: `Who is ${SITE.name} for?`, a: "Describe your main audience here." },
  { q: "How does it work?", a: "Explain the core flow in a sentence or two." },
  { q: "Which integrations are included?", a: "List the main partners or integrations." },
  { q: "How much does it cost?", a: "Explain pricing or the free trial." },
  { q: "How can I get access?", a: "Sign up on the website or book a demo." },
];

const FAQSection = () => (
  <section id="faq" className="py-28 lg:py-40">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-24">
        <div className="lg:sticky lg:top-28 self-start">
          <p className="micro-label mb-4">FAQ</p>
          <h2 className="text-foreground leading-[1.08] mb-5" style={{ fontSize: "clamp(30px, 4vw, 44px)" }}>
            Questions, answered
          </h2>
          <p className="text-[16px] text-muted-foreground max-w-sm leading-relaxed">
            Can't find your answer?{" "}
            <a href={`mailto:${SITE.email}`} className="text-foreground font-semibold underline underline-offset-4 hover:text-success-text">
              Contact us
            </a>
          </p>
        </div>

        <Accordion type="single" collapsible className="border-t border-border">
          {faqs.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border">
              <AccordionTrigger className="text-left text-[17px] font-semibold text-foreground hover:no-underline py-6">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] text-muted-foreground leading-relaxed pb-6 pr-8">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);

export default FAQSection;
