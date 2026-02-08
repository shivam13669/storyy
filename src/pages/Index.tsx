import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Destinations />
      <HowItWorks />
      <TestimonialsCarousel />
      <Footer />
    </div>
  );
};

export default Index;
