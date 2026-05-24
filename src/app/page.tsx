import { Ticker } from "@/components/ticker";
import { LandingNavbar } from "@/components/landing-navbar";
import { Hero } from "@/components/hero";
import { PerformancePreview } from "@/components/performance-preview";
import { ROICalculator } from "@/components/roi-calculator";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Ticker />
      <LandingNavbar />
      <main className="flex-grow">
        <Hero />
        <PerformancePreview />
        <ROICalculator />
        <HowItWorks />
        <Testimonials />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
