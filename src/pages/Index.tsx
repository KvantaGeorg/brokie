import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import SpendingSection from "@/components/SpendingSection";
import NotificationsSection from "@/components/NotificationsSection";
import GamificationSection from "@/components/GamificationSection";
import BanksSection from "@/components/BanksSection";
import WaitlistSection from "@/components/WaitlistSection";
import Footer from "@/components/Footer";
import { ToneProvider } from "@/hooks/use-tone";

const Index = () => (
  <ToneProvider>
    <Navbar />
    <main id="top">
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <SpendingSection />
      <NotificationsSection />
      <GamificationSection />
      <BanksSection />
      <WaitlistSection />
    </main>
    <Footer />
  </ToneProvider>
);

export default Index;
