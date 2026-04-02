import { Star } from "lucide-react";

const HotTours = () => {
  const tours = [
    {
      title: "Benidorm, Spain",
      image: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/product-big-1-600x366_xb1oj5.jpg",
      rating: 4.5,
      reviews: 4,
      description: "Benidorm is a buzzing resort with a big reputation for beach holidays. Situated in sunny Costa Blanca, the town is one of the original Spanish beach resorts...",
      price: "$790"
    },
    {
      title: "Mauritius Island, Africa",
      image: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/product-big-2-600x366_ttlvvi.jpg",
      rating: 4.5,
      reviews: 5,
      description: "The beautiful and inviting island nation of Mauritius is an ideal 'flop and drop' at the conclusion of your safari. Indulge in the delightful scents of the fragrant...",
      price: "$890"
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : i < Math.floor(rating) + 0.5
                ? "fill-yellow-400 text-yellow-400 opacity-50"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h3 className="text-3xl font-bold text-gray-800 mb-12">Hot Tours</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tours.map((tour, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-64">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* Price overlay */}
                <div className="absolute top-0 right-0 bg-[#01b3a7] text-white px-6 py-3 text-xl font-bold transform skew-x-12">
                  {tour.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h5 className="text-2xl font-bold text-gray-800 mb-4">
                  {tour.title}
                </h5>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  {renderStars(tour.rating)}
                  <a href="#" className="text-gray-600 text-sm hover:text-[#01b3a7]">
                    {tour.reviews} customer reviews
                  </a>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {tour.description}
                </p>

                {/* CTA Button */}
                <button className="w-full px-6 py-3 border-2 border-gray-800 text-gray-800 font-semibold rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
                  Buy This Tour
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotTours;
