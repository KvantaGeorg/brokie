import { SITE } from "@/config/site";
import { Logo } from "./brand/Brand";

const Footer = () => (
  <footer className="py-10 bg-background">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
      <div className="flex items-center gap-3">
        <Logo className="text-[20px]" />
        <span className="text-[13px] font-bold text-muted-foreground">{SITE.tagline}</span>
      </div>
      <p className="text-[13px] font-semibold text-muted-foreground max-w-md">{SITE.footerNote}</p>
    </div>
  </footer>
);

export default Footer;
