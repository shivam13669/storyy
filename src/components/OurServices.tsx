import {
  Zap,
  Compass,
  Award,
  Headphones,
  Home,
  DollarSign
} from "lucide-react";

const OurServices = () => {
  const services = [
    {
      title: "Personalised Matching",
      description: "Our unique matching system lets you find just the tour you want for your next holiday.",
      icon: Zap
    },
    {
      title: "Wide Variety of Tours",
      description: "We offer a wide variety of personally picked tours with destinations all over the globe.",
      icon: Compass
    },
    {
      title: "Highly Qualified Service",
      description: "Our tour managers are qualified, skilled, and friendly to bring you the best service.",
      icon: Award
    },
    {
      title: "24/7 Support",
      description: "You can always get professional support from our staff 24/7 and ask any question you have.",
      icon: Headphones
    },
    {
      title: "Handpicked Hotels",
      description: "Our team offers only the best selection of affordable and luxury hotels to our clients.",
      icon: Home
    },
    {
      title: "Best Price Guarantee",
      description: "If you find tours that are cheaper than ours, we will compensate the difference.",
      icon: DollarSign
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-16">
          Our Services
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <div className="flex justify-center mb-6">
                  <Icon size={40} className="text-[#01b3a7]" />
                </div>
                <h5 className="text-xl font-semibold text-gray-800 mb-4">
                  <a href="#" className="hover:text-[#01b3a7] transition-colors">
                    {service.title}
                  </a>
                </h5>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
