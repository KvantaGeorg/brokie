import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE } from "@/config/site";

/* Placeholder legal page: replace the sections below with your own reviewed text. */
const PrivacyPolicy = () => (
  <div className="min-h-screen flex flex-col bg-background text-foreground">
    <Navbar />
    <main className="flex-1 container mx-auto px-6 lg:px-8 pt-32 pb-20 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-10">Last updated: {SITE.legalUpdated}</p>

      <div className="space-y-8 text-base leading-relaxed text-foreground/90">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
          <p>This is placeholder text for the {SITE.name} Privacy Policy. Replace it with your own document before publishing.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3">2. Section title</h2>
          <p>Describe the relevant terms here.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3">3. Contact</h2>
          <p>
            Questions? Email us at{" "}
            <a href={`mailto:${SITE.email}`} className="underline underline-offset-4">
              {SITE.email}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
