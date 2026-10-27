import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/config/site";
import BrokieMascot from "./brand/BrokieMascot";
import { Blobs } from "./product/ProductUI";

const WaitlistSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email");
      return;
    }
    setError("");
    setLoading(true);
    // Front-end only prototype: nothing is sent anywhere
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="waitlist" className="relative px-2 sm:px-3 pb-2 sm:pb-3 scroll-mt-20">
      <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden py-20 lg:py-32 bg-gradient-to-br from-primary-deep via-[hsl(262_60%_22%)] to-background">
        <Blobs variant={1} />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center" aria-live="polite">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <BrokieMascot mood="happy" size={110} className="mx-auto mb-4 animate-float" title="" />
                  <h2 className="mb-4 leading-[1.04]" style={{ fontSize: "clamp(36px, 6vw, 72px)" }}>
                    Ready to level up <span className="text-accent">out of broke?</span>
                  </h2>
                  <p className="text-foreground/85 text-[18px] font-semibold mb-8 max-w-lg mx-auto">
                    Join the waitlist and be the first to meet {SITE.name}.
                  </p>

                  <form onSubmit={handleSubmit} className="max-w-[540px] mx-auto text-left" noValidate>
                    <div className="flex flex-col sm:flex-row gap-2 glass rounded-2xl p-2">
                      <label htmlFor="waitlist-email" className="sr-only">
                        Email
                      </label>
                      <input
                        id="waitlist-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@university.lt"
                        value={email}
                        aria-invalid={!!error}
                        aria-describedby={error ? "waitlist-error" : undefined}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError("");
                        }}
                        className={`flex-1 h-[52px] px-4 bg-white/[0.06] rounded-xl text-[16px] font-bold text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 transition ${
                          error ? "ring-2 ring-destructive" : "focus:ring-accent"
                        }`}
                      />
                      <button type="submit" disabled={loading} className="btn-chunky btn-accent whitespace-nowrap">
                        {loading ? "Joining…" : "Join the waitlist"}
                      </button>
                    </div>
                    {error && (
                      <p id="waitlist-error" className="text-[14px] font-bold text-destructive mt-2 px-2">
                        {error}
                      </p>
                    )}
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="py-4"
                >
                  <BrokieMascot mood="proud" size={120} className="mx-auto mb-5" title="" />
                  <h3 className="text-[32px] mb-2">You're on the list! 🎉</h3>
                  <p className="text-foreground/85 text-[18px] font-semibold">+50 XP for being early. Brokie is shedding a single proud tear.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistSection;
