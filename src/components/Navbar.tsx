import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "./brand/Brand";
import { SITE } from "@/config/site";

export const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "For banks", href: "#banks" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <nav
      aria-label="Main"
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${solid ? "bg-background/95 border-b border-white/[0.08]" : "bg-transparent border-b border-transparent"}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-6">
        <a href="#top" className="flex items-center shrink-0 rounded-lg" aria-label={`${SITE.name} home`}>
          <Logo />
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="px-4 py-2 rounded-full text-[15px] font-bold text-foreground/70 hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link to={SITE.demoPath} className="hidden sm:inline-flex btn btn-accent h-10 px-5 text-[14px]">
            Try the demo
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/15 text-foreground"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-white/[0.08]">
          <div className="container mx-auto px-4 sm:px-6 py-3 flex flex-col">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="px-2 py-3.5 text-[17px] font-extrabold text-foreground/85 border-b border-white/[0.06]">
                {link.label}
              </a>
            ))}
            <Link to={SITE.demoPath} onClick={() => setOpen(false)} className="btn btn-accent mt-4">
              Try the demo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
