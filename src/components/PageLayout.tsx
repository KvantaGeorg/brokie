import { useEffect, type ReactNode } from "react";
import Navbar from "./Navbar";
import WaitlistSection from "./WaitlistSection";
import Footer from "./Footer";
import { SectionIndexContext } from "./product/ProductUI";
import { SITE } from "@/config/site";

/* Shared shell for the standalone section pages: nav, the section itself, then the sign-up block and footer. */
const PageLayout = ({ title, children }: { title: string; children: ReactNode }) => {
  useEffect(() => {
    document.title = `${title} | ${SITE.name}`;
    return () => {
      document.title = SITE.name;
    };
  }, [title]);

  return (
    <>
      <Navbar />
      <SectionIndexContext.Provider value={false}>
        <main className="pt-16 sm:pt-[72px]">{children}</main>
      </SectionIndexContext.Provider>
      <WaitlistSection />
      <Footer />
    </>
  );
};

export default PageLayout;
