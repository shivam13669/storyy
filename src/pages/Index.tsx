import Navigation from "@/components/Navigation";
import HeroSlider from "@/components/HeroSlider";
import CategoryBoxes from "@/components/CategoryBoxes";
import DiscoverNewHorizons from "@/components/DiscoverNewHorizons";
import OurServices from "@/components/OurServices";
import HotTours from "@/components/HotTours";
import Team from "@/components/Team";
import ParallaxCTA from "@/components/ParallaxCTA";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSlider />
      <CategoryBoxes />
      <DiscoverNewHorizons />
      <OurServices />
      <HotTours />
      <Team />
      <ParallaxCTA />
      <Gallery />
      <Footer />
    </div>
  );
};

export default Index;
