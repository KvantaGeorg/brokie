import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Brand";
import PhoneMockup from "@/components/product/PhoneMockup";
import ToneToggle from "@/components/ToneToggle";
import { ToneProvider } from "@/hooks/use-tone";
import { SITE } from "@/config/site";

/* The full interactive app demo: the phone on its own. */
const Demo = () => {
  useEffect(() => {
    document.title = `Demo | ${SITE.name}`;
    return () => {
      document.title = `${SITE.name} · Level up out of broke`;
    };
  }, []);

  return (
    <ToneProvider>
      <div className="min-h-screen flex flex-col">
        <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between">
          <Link to="/" className="rounded-lg" aria-label={`${SITE.name} home`}>
            <Logo />
          </Link>
          <Link to="/" className="btn btn-outline h-10 px-4 text-[14px]">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to site
          </Link>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-10">
          <h1 className="sr-only">{SITE.name} app demo</h1>
          <PhoneMockup />
          <ToneToggle />
        </main>
      </div>
    </ToneProvider>
  );
};

export default Demo;
