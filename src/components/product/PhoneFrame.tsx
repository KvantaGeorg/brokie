import { forwardRef, type ReactNode } from "react";

/* Phone hardware: bezel, notch and the screen area. Shared by the interactive demo and the hero preview. */
const PhoneFrame = forwardRef<HTMLElement, { label: string; children: ReactNode; className?: string }>(({ label, children, className = "" }, ref) => (
  <figure ref={ref} className={`relative mx-auto w-[300px] sm:w-[320px] ${className}`} aria-label={label}>
    <div className="relative rounded-[46px] p-[10px] bg-[hsl(258_40%_5%)] border border-white/[0.12]">
      <div className="relative h-[620px] rounded-[38px] overflow-hidden bg-[hsl(258_42%_10%)] text-white">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-black z-50" aria-hidden="true" />
        {children}
      </div>
    </div>
  </figure>
));

PhoneFrame.displayName = "PhoneFrame";

export default PhoneFrame;
