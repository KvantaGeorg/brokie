import type { Tone } from "@/data/notifications";
import { useTone } from "@/hooks/use-tone";

/* Gentle / Savage switch for Brokie's tone. */
const ToneToggle = ({ className = "" }: { className?: string }) => {
  const { tone, setTone } = useTone();
  const options: { id: Tone; label: string }[] = [
    { id: "gentle", label: "Gentle" },
    { id: "savage", label: "Savage" },
  ];
  return (
    <div role="radiogroup" aria-label="Brokie's tone" className={`inline-flex rounded-full border border-white/15 p-1 ${className}`}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={tone === o.id}
          onClick={() => setTone(o.id)}
          className={`h-9 px-5 rounded-full text-[14px] font-extrabold transition-colors ${tone === o.id ? "bg-accent text-accent-foreground" : "text-foreground/70 hover:text-foreground"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
};

export default ToneToggle;
