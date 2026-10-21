import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SuppliersLine from "@/components/SuppliersLine";
import StatementSection from "@/components/StatementSection";
import BenefitsSection from "@/components/BenefitsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ProposalsSection from "@/components/ProposalsSection";
import FAQSection from "@/components/FAQSection";
import WaitlistSection from "@/components/WaitlistSection";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Navbar />
    <HeroSection />
    <SuppliersLine />
    <StatementSection />
    <HowItWorksSection />
    <ProposalsSection />
    <BenefitsSection />
    <FAQSection />
    <WaitlistSection />
    <Footer />
  </>
);

export default Index;
