import { Link } from "react-router-dom";
import { SITE } from "@/config/site";
import { Logo } from "./brand/Brand";
import { navLinks } from "./Navbar";

const Footer = () => (
  <footer className="border-t border-white/[0.08] py-12">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div>
          <Logo className="text-[20px]" />
          <p className="text-[14px] font-bold text-muted-foreground mt-2">{SITE.tagline}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-[14px] font-bold">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-foreground/70 hover:text-foreground">
              {l.label}
            </a>
          ))}
          <Link to={SITE.demoPath} className="text-accent hover:underline underline-offset-4">
            Try the demo
          </Link>
        </nav>
      </div>
      <p className="text-[13px] font-semibold text-muted-foreground mt-10 max-w-2xl">{SITE.footerNote}</p>
    </div>
  </footer>
);

export default Footer;
