import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Brand";
import PhoneMockup from "@/components/product/PhoneMockup";
import { Blobs } from "@/components/product/ProductUI";
import { ToneToggle } from "@/components/NotificationsSection";
import { ToneProvider } from "@/hooks/use-tone";
import { SITE } from "@/config/site";

/* Standalone app demo: the phone on its own, as the base for building out Brokie's features. */
const Demo = () => {
  useEffect(() => {
    document.title = `Demo | ${SITE.name}`;
    return () => {
      document.title = `${SITE.name} · Level up out of broke`;
    };
  }, []);

  return (
    <ToneProvider>
      <div className="relative min-h-screen overflow-hidden flex flex-col">
        <Blobs variant={0} />

        <header className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between">
          <Link to="/" className="rounded-lg" aria-label={`${SITE.name} home`}>
            <Logo />
          </Link>
          <Link to="/" className="btn-chunky btn-glass h-11 px-4 text-[15px]">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to site
          </Link>
        </header>

        <main className="relative flex-1 flex flex-col items-center justify-center gap-8 px-4 py-10">
          <h1 className="sr-only">{SITE.name} app demo</h1>
          <PhoneMockup />
          <ToneToggle />
          <p className="text-[13px] font-semibold text-muted-foreground text-center">Demo uses mock data.</p>
        </main>
      </div>
    </ToneProvider>
  );
};

export default Demo;
