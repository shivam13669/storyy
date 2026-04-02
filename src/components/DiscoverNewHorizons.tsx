import { useState } from "react";
import { Link } from "react-router-dom";

const DiscoverNewHorizons = () => {
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    {
      id: "about",
      name: "About us",
      content: "Wonder Tour is committed to bringing our clients the best in value and quality travel arrangements. We are passionate about travel and sharing the world's wonders with you."
    },
    {
      id: "why",
      name: "Why choose us",
      content: "We are proud to offer excellent quality and value for money in our tours, which give you the chance to experience your chosen destination in an authentic and exciting way."
    },
    {
      id: "mission",
      name: "Our mission",
      content: "Our mission is to provide the ultimate travel planning experience while becoming a one-stop shop for every travel service available in the industry."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className="flex justify-center animate-fade-in">
            <img
              src="https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/index-3-556x382_z5nxzq.jpg"
              alt="Discover New Horizons"
              className="rounded-lg shadow-lg max-w-md w-full"
            />
          </div>

          {/* Right: Tabs */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-8">
              Discover New Horizons
            </h3>

            {/* Tab Navigation */}
            <div className="border-b-2 border-gray-200 mb-8">
              <div className="flex gap-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 font-semibold text-lg transition-colors relative ${
                      activeTab === tab.id
                        ? "text-[#01b3a7]"
                        : "text-gray-700 hover:text-[#01b3a7]"
                    }`}
                  >
                    {tab.name}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#01b3a7]"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`transition-all duration-300 ${
                  activeTab === tab.id ? "block animate-fade-in" : "hidden"
                }`}
              >
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {tab.content}
                </p>

                {/* Buttons */}
                <div className="flex gap-4 flex-wrap">
                  <Link
                    to="/contact"
                    className="px-6 py-3 bg-[#01b3a7] text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Get in Touch
                  </Link>
                  <Link
                    to="#"
                    className="px-6 py-3 border-2 border-gray-800 text-gray-800 font-semibold rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverNewHorizons;
