import { Link } from "react-router-dom";
import { SITE } from "@/config/site";
import { Logo } from "./brand/Brand";

const Footer = () => (
  <footer className="py-8 bg-background border-t border-border">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-5">
      <div className="flex items-center gap-3">
        <Logo className="text-[16px]" />
        <span className="text-xs text-muted-foreground hidden sm:inline">&copy; {new Date().getFullYear()} {SITE.name}</span>
      </div>

      <div className="flex items-center gap-5">
        <Link to="/terms-of-service" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
        <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
      </div>

      <div className="flex items-center gap-4">
        <a href={`mailto:${SITE.email}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">{SITE.email}</a>
        <a href={SITE.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={`${SITE.name} on LinkedIn`} className="text-muted-foreground hover:text-foreground transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
