import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { SITE } from "@/config/site";
import { BackersRow } from "./brand/Brand";

const WaitlistSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid work email");
      return;
    }
    setError("");
    setLoading(true);
    // TODO: send `trimmed` to your backend / form service here
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="waitlist" className="px-2 sm:px-3 pb-2 sm:pb-3">
      <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden py-24 lg:py-36 bg-[#F1F4F2]">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <BackersRow className="mb-6" />
                <h2
                  className="font-bold text-foreground mb-4 tracking-[-0.045em] leading-[1.02]"
                  style={{ fontSize: "clamp(40px, 7vw, 92px)" }}
                >
                  Stop opening tabs.<br />Start comparing.
                </h2>
                <p className="text-muted-foreground text-[18px] mb-8 max-w-lg mx-auto">
                  Be among the first teams to try {SITE.name}.
                </p>

                <form onSubmit={handleSubmit} className="max-w-[560px] mx-auto text-left">
                  <div className="flex flex-col sm:flex-row gap-1.5 bg-background border border-border rounded-2xl shadow-card p-1.5">
                    <input
                      type="email"
                      placeholder="Work email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      className={`flex-1 h-12 px-4 bg-transparent rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition ${
                        error ? "ring-2 ring-destructive/40" : "focus:ring-primary/20"
                      }`}
                    />
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileTap={{ scale: 0.97 }}
                      className="h-12 px-6 bg-foreground text-background font-semibold rounded-xl hover:bg-foreground/85 transition-colors disabled:opacity-60 whitespace-nowrap"
                    >
                      {loading ? "Submitting…" : "Start free trial"}
                    </motion.button>
                  </div>
                  {error && <p className="text-xs text-destructive mt-2 px-1.5">{error}</p>}
                </form>

              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                className="py-4"
              >
                <div className="w-12 h-12 rounded-full bg-success-soft flex items-center justify-center mb-5 mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-success-text" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-2 tracking-[-0.025em]">
                  Thanks for joining the waitlist
                </h3>
                <p className="text-muted-foreground">We'll be in touch soon.</p>
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
