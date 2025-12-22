import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/sections/hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { CurrencyShowcase } from "@/components/sections/currency-showcase";
import { FeaturesSection } from "@/components/sections/features-section";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { AppPreview } from "@/components/sections/app-preview";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        <ServicesGrid />
        <CurrencyShowcase />
        <FeaturesSection />
        <Testimonials />
        <FAQ />
        <AppPreview />
      </main>
      <Footer />
    </>
  );
}
