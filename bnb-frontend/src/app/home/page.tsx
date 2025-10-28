import HeroSection from "@/components/home/HeroSection";
import ExploreSection from "@/components/home/ExploreSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FindPlaceSection from "@/components/home/FindPlaceSection";

export default function HomePage() {
  return (
    <div className="bg-base-100">
      <FindPlaceSection />
      <HeroSection />
      <ExploreSection />
      <HowItWorksSection />
    </div>
  );
}
