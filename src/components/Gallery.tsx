import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";

const Gallery = () => {
  const swiperRef = useRef(null);
  const [lightboxOpen, setLightboxOpen] = useState<number | null>(null);

  const galleryImages = [
    {
      thumb: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/gallery-image-1-270x195_xlkcmo.jpg",
      full: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/gallery-image-1-1200x800-original_oxv2qa.jpg"
    },
    {
      thumb: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/gallery-image-2-270x195_hvtwam.jpg",
      full: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/gallery-image-2-1200x800-original_vv0ksy.jpg"
    },
    {
      thumb: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/gallery-image-3-270x195_d5nxq1.jpg",
      full: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/gallery-image-3-1200x800-original_ydyzfr.jpg"
    },
    {
      thumb: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/gallery-image-4-270x195_wyj6gv.jpg",
      full: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/gallery-image-4-1200x800-original_zpx7fs.jpg"
    },
    {
      thumb: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/gallery-image-5-270x195_u4xnbq.jpg",
      full: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/gallery-image-5-1200x800-original_kx2y9r.jpg"
    },
    {
      thumb: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/gallery-image-6-270x195_wza1xj.jpg",
      full: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/gallery-image-6-1200x800-original_vhvcbk.jpg"
    },
    {
      thumb: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/gallery-image-7-270x195_fxgvkk.jpg",
      full: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/gallery-image-7-1200x800-original_xlnjws.jpg"
    }
  ];

  return (
    <section className="py-20 bg-gray-100 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header with title */}
        <div className="flex items-center justify-center mb-12 relative">
          <h2 className="text-3xl font-bold text-gray-800 bg-white px-6 py-3 rounded-lg shadow-md">
            Gallery
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Autoplay]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false
            }}
            navigation={{
              nextEl: ".gallery-next",
              prevEl: ".gallery-prev"
            }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 20 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
              1280: { slidesPerView: 5, spaceBetween: 20 },
              1400: { slidesPerView: 6, spaceBetween: 20 }
            }}
          >
            {galleryImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative group overflow-hidden rounded-lg">
                  <img
                    src={image.thumb}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => setLightboxOpen(index)}
                      className="bg-[#01b3a7] text-white p-3 rounded-lg hover:bg-opacity-90 transition-colors"
                      aria-label="Zoom gallery image"
                    >
                      <ZoomIn size={24} />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation arrows */}
          <button
            className="gallery-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 bg-gray-400 hover:bg-[#01b3a7] text-white p-3 rounded-lg transition-colors"
            aria-label="Previous gallery image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="gallery-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 bg-gray-400 hover:bg-[#01b3a7] text-white p-3 rounded-lg transition-colors"
            aria-label="Next gallery image"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Lightbox modal */}
      {lightboxOpen !== null && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxOpen(null)}
        >
          <div className="relative max-w-4xl w-full">
            <img
              src={galleryImages[lightboxOpen].full}
              alt="Full gallery image"
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={() => setLightboxOpen(null)}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-lg transition-colors"
              aria-label="Close lightbox"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
