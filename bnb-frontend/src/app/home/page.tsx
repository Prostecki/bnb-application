import HeroSection from "@/components/home/HeroSection";
import ExploreSection from "@/components/home/ExploreSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";

export default function HomePage() {
  return (
    <div className="bg-base-100">
      <HeroSection />
      <ExploreSection />
      <HowItWorksSection />
    </div>
  );
}
