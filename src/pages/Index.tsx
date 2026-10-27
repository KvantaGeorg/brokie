import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import SpendingSection from "@/components/SpendingSection";
import BudgetGoalsSection from "@/components/BudgetGoalsSection";
import GamificationSection from "@/components/GamificationSection";
import NotificationsSection from "@/components/NotificationsSection";
import BanksSection from "@/components/BanksSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";
import { ToneProvider } from "@/hooks/use-tone";

/* Story: what Brokie is → why → how → understand → plan → habits → personality → banks → try it. */
const Index = () => (
  <ToneProvider>
    <Navbar />
    <main id="top">
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <SpendingSection />
      <BudgetGoalsSection />
      <GamificationSection />
      <NotificationsSection />
      <BanksSection />
      <FinalCtaSection />
    </main>
    <Footer />
  </ToneProvider>
);

export default Index;
