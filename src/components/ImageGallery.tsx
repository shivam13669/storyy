import { Images } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  destinationName: string;
}

const ImageGallery = ({ images, destinationName }: ImageGalleryProps) => {
  if (!images.length) return null;

  const [primary, ...rest] = images;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-6">
      {/* Main Image */}
      <div className="lg:col-span-2 relative rounded-lg overflow-hidden h-[300px] md:h-[450px]">
        <img
          src={primary}
          alt="Scenic view"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Side Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Image 1 */}
        <div className="relative rounded-lg overflow-hidden h-[145px] md:h-[220px]">
          <img
            src={rest[0]}
            alt="Destinations"
            className="w-full h-full object-cover"
          />
          <div className="image-overlay" />
          <span className="absolute bottom-3 left-3 text-primary-foreground font-medium text-sm">
            Destinations
          </span>
        </div>

        {/* Image 2 */}
        <div className="relative rounded-lg overflow-hidden h-[145px] md:h-[220px]">
          <img
            src={rest[1]}
            alt="Stays"
            className="w-full h-full object-cover"
          />
          <div className="image-overlay" />
          <span className="absolute bottom-3 left-3 text-primary-foreground font-medium text-sm">
            Stays
          </span>
        </div>

        {/* Image 3 */}
        <div className="relative rounded-lg overflow-hidden h-[145px] md:h-[220px]">
          <img
            src={rest[2]}
            alt="Activity"
            className="w-full h-full object-cover"
          />
          <div className="image-overlay" />
          <span className="absolute bottom-3 left-3 text-primary-foreground font-medium text-sm">
            Activity
          </span>
        </div>

        {/* View All Images */}
        <div className="relative rounded-lg overflow-hidden h-[145px] md:h-[220px]">
          <img
            src={rest[3]}
            alt="View All"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <button className="absolute bottom-3 right-3 flex items-center gap-2 bg-background text-foreground px-3 py-2 rounded-full text-sm font-medium hover:bg-muted transition-colors">
            <Images className="w-4 h-4" />
            View All Images
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
