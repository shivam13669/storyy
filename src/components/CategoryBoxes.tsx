const CategoryBoxes = () => {
  const categories = [
    {
      title: "Balloon Flights",
      image: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/cta-1-368x420_c3v2vt.jpg"
    },
    {
      title: "Mountain Holiday",
      image: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/cta-2-368x420_kfvzha.jpg"
    },
    {
      title: "Beach Holidays",
      image: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/cta-3-368x420_ozovwb.jpg"
    }
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            >
              <a href="#" className="block overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />
              </a>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  <a href="#" className="hover:text-[#01b3a7] transition-colors">
                    {category.title}
                  </a>
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="#"
            className="inline-flex items-center text-lg font-semibold text-gray-800 hover:text-[#01b3a7] transition-colors group"
          >
            Other Tours
            <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CategoryBoxes;
