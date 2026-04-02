import { Link } from "react-router-dom";

const ParallaxCTA = () => {
  return (
    <section
      className="relative py-20 bg-cover bg-center bg-fixed text-white text-center"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/parallax-1-1920x850_b5wbvb.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "50% 50%",
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            First-class Impressions{" "}
            <span className="block">are Waiting for You!</span>
          </h2>

          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Our agency offers travelers various tours and excursions with destinations all over the world. Browse our website to find your dream tour!
          </p>

          <Link
            to="#"
            className="inline-block px-8 py-4 bg-[#01b3a7] text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Book a Tour Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ParallaxCTA;
