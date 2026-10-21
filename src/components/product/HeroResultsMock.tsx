import { useEffect, useState } from "react";
import { HOTEL_PHOTOS, HotelCardMock, ProgressStrip, ProposalBar } from "./ProductUI";
import { SITE } from "@/config/site";

const HeroResultsMock = () => {
  const [answered, setAnswered] = useState(1);

  useEffect(() => {
    const t = setInterval(() => setAnswered((a) => (a >= 4 ? 1 : a + 1)), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative rounded-[20px] border border-border bg-background shadow-card overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 h-9 border-b border-border bg-subtle">
        <span className="w-2.5 h-2.5 rounded-full bg-border" />
        <span className="w-2.5 h-2.5 rounded-full bg-border" />
        <span className="w-2.5 h-2.5 rounded-full bg-border" />
        <span className="ml-3 text-[11px] text-muted-foreground">{SITE.appDomain}</span>
      </div>

      <div className="p-5 sm:p-8 pb-24 space-y-5">
        <h3 className="text-[20px] sm:text-[24px] font-bold tracking-[-0.03em]">214 hotels with live rates in Berlin</h3>
        <ProgressStrip answered={answered} />
        <HotelCardMock
          name="Mitte Central Hotel"
          address="Torstraße, Berlin"
          walk="1 min walk · 70 m to venue"
          stars={3}
          photo={HOTEL_PHOTOS.roomWhite}
          rates={[
            { supplier: 0, price: 57 },
            { supplier: 3, price: 67 },
          ]}
        />
        <HotelCardMock
          name="Spree Garden Hotel"
          address="Friedrichstraße, Berlin"
          walk="5 min walk · 320 m to venue"
          stars={4}
          tone={1}
          photo={HOTEL_PHOTOS.roomGarden}
          rates={[
            { supplier: 3, price: 316 },
            { supplier: 0, price: 324 },
            { supplier: 1, price: 374 },
          ]}
        />
      </div>

      <div className="absolute z-10 bottom-4 left-1/2 -translate-x-1/2 max-w-[calc(100%-2rem)]">
        <ProposalBar />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default HeroResultsMock;
