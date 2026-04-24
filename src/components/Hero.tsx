import React, { useEffect, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const images = [
  { src: "https://cdn.builder.io/api/v1/image/assets%2F00925d433c464f42bfbd8fae9c252b3b%2F9f3f8b596da24833822556c18af6a74a?format=webp", alt: "Adventure 1" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2F00925d433c464f42bfbd8fae9c252b3b%2F0a4b1da12f8a4689863dc1dc542a7673?format=webp", alt: "Adventure 2" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fad2d7d0632944f2a99e3df5568d6e82b%2F0a7a70bdabaa42b59defe24592c1de02?format=webp", alt: "Adventure 3" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2F00925d433c464f42bfbd8fae9c252b3b%2F8a6ac40406994fb59e3150c5cef9ee5b?format=webp", alt: "Adventure 4" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2F00925d433c464f42bfbd8fae9c252b3b%2Fa4d4ea6f923843ce9c18b3391c014b29?format=webp", alt: "Adventure 5" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fad2d7d0632944f2a99e3df5568d6e82b%2Fcd029c6f59694c71adb520aeae55044f?format=webp", alt: "Adventure 7" },
];

const TRANSITION_MS = 1000;
const INTERVAL_MS = 5000;

const Hero: React.FC = () => {
  const [index, setIndex] = useState(0);

  // Preload images
  useEffect(() => {
    images.forEach((img) => {
      const i = new Image();
      i.src = img.src;
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background carousel */}
      <div className="absolute inset-0">
        {images.map((img, i) => (
          <div
            key={img.src}
            aria-hidden={i !== index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000`}
            style={{
              backgroundImage: `url(${img.src})`,
              opacity: i === index ? 1 : 0,
              transitionDuration: `${TRANSITION_MS}ms`,
            }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              Discover Your Next
              <span className="block gradient-adventure bg-clip-text text-transparent pt-2">Adventure</span>
            </h1>

            <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed font-light">
              Discover breathtaking landscapes, thrilling expeditions, and unforgettable journeys designed to inspire your spirit of exploration and adventure.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-slide-up">
            <Button asChild variant="hero" size="xl" className="group">
              <Link to="/destinations" className="inline-flex items-center">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button variant="glass" size="xl" className="group">
              <Play className="mr-2 h-5 w-5" />
              Watch Stories
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-md mx-auto">
            <div className="text-center animate-float">
              <div className="text-3xl md:text-4xl font-bold text-white">500+</div>
              <div className="text-white/70 text-xs md:text-sm pt-2">Adventures</div>
            </div>
            <div className="text-center animate-float" style={{ animationDelay: "0.5s" }}>
              <div className="text-3xl md:text-4xl font-bold text-white">10k+</div>
              <div className="text-white/70 text-xs md:text-sm pt-2">Happy Travelers</div>
            </div>
            <div className="text-center animate-float" style={{ animationDelay: "1s" }}>
              <div className="text-3xl md:text-4xl font-bold text-white">3+</div>
              <div className="text-white/70 text-xs md:text-sm pt-2">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
