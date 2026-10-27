import { SITE } from "@/config/site";
import BrokieMascot from "./BrokieMascot";

/* Wordmark: the Brokie coin plus the name. */
export const Logo = ({ className = "text-[22px]" }: { className?: string }) => (
  <span className={`inline-flex items-center gap-1.5 font-black tracking-[-0.02em] text-foreground ${className}`}>
    <BrokieMascot size={30} title="" />
    {SITE.name}
  </span>
);
