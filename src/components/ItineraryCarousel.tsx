import { useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

interface ItineraryCarouselProps {
  images: string[];
  days: number;
  location: string;
  totalImages: number;
}

const ItineraryCarousel = ({ images, days, location, totalImages }: ItineraryCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative rounded-xl overflow-hidden h-[300px] md:h-[400px] mb-4">
      <img
        src={images[currentIndex]}
        alt={location}
        className="w-full h-full object-cover"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      {/* Location info */}
      <div className="absolute bottom-4 left-4">
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold text-primary-foreground">{days}</span>
          <div className="mb-1">
            <span className="text-primary-foreground/80 text-sm">Days in</span>
            <h3 className="text-2xl font-bold text-primary-foreground">{location}</h3>
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary-foreground/50" />
        <span className="text-primary-foreground text-sm px-2 py-0.5 bg-black/40 rounded">
          {currentIndex + 1}/{images.length}
        </span>
        <div className="w-2 h-2 rounded-full bg-primary-foreground/50" />
      </div>

      {/* Thumbnail previews */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1">
        {images.slice(0, 3).map((img, idx) => (
          <div key={idx} className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-foreground">
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        {totalImages > 3 && (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
            +{totalImages - 3}
          </div>
        )}
      </div>

      {/* Download button */}
      <button className="absolute bottom-16 right-4 w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-lg hover:bg-muted transition-colors">
        <Download className="w-5 h-5 text-primary" />
      </button>
    </div>
  );
};

export default ItineraryCarousel;
