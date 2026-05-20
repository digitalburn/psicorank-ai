import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingMockup } from "@/components/landing/landing-mockup";
import { LandingPricing } from "@/components/landing/landing-pricing";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function HomePage() {
  return (
    <div className="landing-bg min-h-screen text-slate-950 dark:text-white">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingMockup />
        <LandingPricing />
        <LandingFaq />
      </main>
      <LandingFooter />
    </div>
  );
}
