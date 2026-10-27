import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import StudentDataSection from "@/components/StudentDataSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import SpendingSection from "@/components/SpendingSection";
import BudgetGoalsSection from "@/components/BudgetGoalsSection";
import GamificationSection from "@/components/GamificationSection";
import NotificationsSection from "@/components/NotificationsSection";
import LearnSection from "@/components/LearnSection";
import BanksSection from "@/components/BanksSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";
import { ToneProvider } from "@/hooks/use-tone";

/* Story: what Brokie is → why → our data → how → understand → plan → habits → learn → personality → banks → try it. */
const Index = () => (
  <ToneProvider>
    <Navbar />
    <main id="top">
      <HeroSection />
      <ProblemSection />
      <StudentDataSection />
      <HowItWorksSection />
      <SpendingSection />
      <BudgetGoalsSection />
      <GamificationSection />
      <LearnSection />
      <NotificationsSection />
      <BanksSection />
      <FinalCtaSection />
    </main>
    <Footer />
  </ToneProvider>
);

export default Index;
