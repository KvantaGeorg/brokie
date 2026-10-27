import { createContext, useContext, useState, type ReactNode } from "react";
import type { Tone } from "@/data/notifications";

/* Gentle / Savage mode, shared by every place that shows example notifications. */
const ToneContext = createContext<{ tone: Tone; setTone: (t: Tone) => void }>({ tone: "gentle", setTone: () => {} });

export const ToneProvider = ({ children }: { children: ReactNode }) => {
  const [tone, setTone] = useState<Tone>("gentle");
  return <ToneContext.Provider value={{ tone, setTone }}>{children}</ToneContext.Provider>;
};

export const useTone = () => useContext(ToneContext);
