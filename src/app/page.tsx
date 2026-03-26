import { LandingNavbar } from "@/components/landing-navbar";
import { Hero } from "@/components/hero";
import { PerformancePreview } from "@/components/performance-preview";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      <main className="flex-grow">
        <Hero />
        <PerformancePreview />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
