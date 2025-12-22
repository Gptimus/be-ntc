import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/sections/hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { CurrencyShowcase } from "@/components/sections/currency-showcase";
import { FeaturesSection } from "@/components/sections/features-section";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { AppPreview } from "@/components/sections/app-preview";
import { Footer } from "@/components/sections/footer";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { ContactForm } from "@/components/sections/contact-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({ locale, namespace: "home.metadata" });
}

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
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
