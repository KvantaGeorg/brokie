import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import BanksSection from "@/components/BanksSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";
import { ToneProvider } from "@/hooks/use-tone";

/* Story: what Brokie is → why (with our data) → how → what keeps you going → banks → try it. */
const Index = () => (
  <ToneProvider>
    <Navbar />
    <main id="top">
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <BanksSection />
      <FinalCtaSection />
    </main>
    <Footer />
  </ToneProvider>
);

export default Index;
