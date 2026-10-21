import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./brand/Brand";
import { NavLink } from "./NavLink";
import { SITE } from "@/config/site";

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "Problem", to: "/problem" },
  { label: "How it works", to: "/how-it-works" },
  { label: "Proposals", to: "/proposals" },
  { label: "Benefits", to: "/benefits" },
  { label: "FAQ", to: "/faq" },
];

const DEMO_URL = SITE.demoUrl;
export const SIGNUP_URL = SITE.signupUrl;

const Navbar = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => setOpen(false), [pathname]);

  const TrialLink = ({ className, onClick }: { className: string; onClick?: () => void }) => (
    <a href={SIGNUP_URL} onClick={onClick} className={className}>
      Start free trial
    </a>
  );

  // Transparent only over the home hero; solid everywhere else or once the menu is open
  const solid = !isHome || scrolled || open;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        solid ? "bg-background/90 backdrop-blur-xl border-b border-border" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center shrink-0" aria-label={`${SITE.name} home`}>
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className="px-3.5 py-2 rounded-full text-[14px] font-medium text-foreground/65 hover:text-foreground transition-colors"
              activeClassName="text-foreground bg-foreground/[0.06]"
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center h-10 px-4 text-sm font-semibold text-foreground rounded-full hover:bg-foreground/[0.06] transition-colors"
          >
            Book a demo
          </a>
          <TrialLink className="hidden sm:inline-flex items-center h-10 px-5 bg-foreground text-background text-sm font-semibold rounded-full hover:bg-foreground/85 transition-colors" />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-border bg-background text-foreground"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end
                  className="px-3 py-3.5 text-[17px] font-semibold text-foreground/60 border-b border-border"
                  activeClassName="text-foreground"
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-12 rounded-full border border-border text-[15px] font-semibold"
                >
                  Book a demo
                </a>
                <TrialLink
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center h-12 rounded-full bg-foreground text-background text-[15px] font-semibold"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
