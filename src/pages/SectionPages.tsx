import PageLayout from "@/components/PageLayout";
import StatementSection from "@/components/StatementSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ProposalsSection from "@/components/ProposalsSection";
import BenefitsSection from "@/components/BenefitsSection";
import FAQSection from "@/components/FAQSection";

/* Standalone pages that reuse the home-page sections as-is. */

export const ProblemPage = () => (
  <PageLayout title="The problem">
    <StatementSection />
  </PageLayout>
);

export const HowItWorksPage = () => (
  <PageLayout title="How it works">
    <HowItWorksSection />
  </PageLayout>
);

export const ProposalsPage = () => (
  <PageLayout title="Proposals">
    <ProposalsSection />
  </PageLayout>
);

export const BenefitsPage = () => (
  <PageLayout title="Benefits">
    <BenefitsSection />
  </PageLayout>
);

export const FAQPage = () => (
  <PageLayout title="FAQ">
    <FAQSection />
  </PageLayout>
);
