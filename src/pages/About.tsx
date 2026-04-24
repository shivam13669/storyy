import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { MapPin, Zap, Heart, Users, Target, Shield, Compass, Award } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const AnimatedNumber = ({ endString }: { endString: string }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const match = endString.match(/^(\d+)(.*)$/);
  const endNum = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTimestamp: number | null = null;
          const duration = 2000;

          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(easeOut * endNum));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [endNum]);

  return (
    <div ref={nodeRef} className="text-4xl font-black mb-1">
      {count}{suffix}
    </div>
  );
};

const AnimatedSection = ({ children, className, animationClass }: { children: React.ReactNode, className?: string, animationClass: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={nodeRef} className={`${className || ""} ${isVisible ? animationClass : "opacity-0"}`}>
      {children}
    </div>
  );
};

export default function AboutPage() {
  const stats = [
    { number: "500+", label: "Expeditions", icon: MapPin, color: "from-orange-400 to-red-500" },
    { number: "10K+", label: "Travelers", icon: Users, color: "from-blue-400 to-indigo-600" },
    { number: "6", label: "Regions", icon: Compass, color: "from-emerald-400 to-teal-600" },
    { number: "2020", label: "Founded", icon: Award, color: "from-purple-400 to-pink-500" },
  ];

  const whyUs = [
    {
      icon: Zap,
      title: "Expert-Led Adventure",
      description: "Our guides are seasoned adventurers with years of experience navigating every mountain pass, hidden trail, and scenic viewpoint across our regions. They don't just show you the route they share stories, culture, and insider knowledge that transform your journey.",
      color: "text-orange-500",
      bg: "bg-orange-50",
      border: "border-orange-200"
    },
    {
      icon: Heart,
      title: "Authentic Experiences",
      description: "We partner with local communities, homestays, and cultural custodians to create genuine connections. You'll taste authentic cuisine, learn real stories, and leave a positive impact on the places you visit.",
      color: "text-rose-500",
      bg: "bg-rose-50",
      border: "border-rose-200"
    },
    {
      icon: Shield,
      title: "Safety First Philosophy",
      description: "Your safety is non negotiable. We conduct rigorous risk assessments, maintain state of the art equipment, coordinate with local authorities, and have comprehensive emergency protocols for every expedition.",
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-200"
    },
    {
      icon: Target,
      title: "Personalized Itineraries",
      description: "Whether you're a solo rider seeking solitude, a family looking for bonding experiences, a corporate team building trust, or a luxury traveler craving comfort we have curated routes designed specifically for you.",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-200"
    },
  ];

  const journey = [
    {
      year: "October 2020",
      title: "The Beginning",
      desc: "Stories by Foot is born from PlanYorTrip with a revolutionary vision: to redefine adventure travel. Our founding team launches the first expeditions in Ladakh with 15 riders who become our inspiration."
    },
    {
      year: "2021-2022",
      title: "Rapid Expansion",
      desc: "We expand across India's most breathtaking regions like Zanskar, Meghalaya, and Tawang join our portfolio. Our community grows to 1000+ travelers. We launch safety certifications and sustainability initiatives."
    },
    {
      year: "2023-2024",
      title: "Going International",
      desc: "Stories by Foot crosses borders into Bhutan and Upper Mustang. We reach our 500th expedition milestone and welcome the 10,000th traveler. International partnerships strengthen our global presence."
    },
    {
      year: "Today",
      title: "A Global Community",
      desc: "We've become more than a tour operator we're a movement. A family of 10,000+ explorers across 20+ countries, united by passion for authentic travel, meaningful stories, and transformative journeys."
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-0 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Main Hero with Image */}
          <div className="grid md:grid-cols-2 gap-0 items-stretch mb-0">
            {/* Left side - Image */}
            <div className="relative h-96 md:h-full md:min-h-screen overflow-hidden rounded-none md:rounded-l-3xl">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F00925d433c464f42bfbd8fae9c252b3b%2F9f3f8b596da24833822556c18af6a74a?format=webp&width=1200"
                alt="Expedition experience"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20"></div>
            </div>

            {/* Right side - Content */}
            <div className="bg-gradient-to-br from-white via-orange-50 to-pink-50 px-8 md:px-12 py-12 md:py-20 flex flex-col justify-center rounded-none md:rounded-r-3xl">
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4">
                    <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Travel</span>
                    <span className="text-slate-900"> is More Than Places</span>
                  </h1>
                  <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                    It's the stories you collect on the road, the people you meet, and the person you become.
                  </p>
                </div>

                <div className="space-y-6 border-t border-orange-200 pt-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">From PlanYorTrip to Stories by Foot</h2>
                    <p className="text-slate-600 leading-relaxed">
                      <strong>Founded in October 2020</strong>, we had a revelation: traditional travel platforms were missing the human element, the cultural depth, and the transformative power of real adventure.
                    </p>
                  </div>

                  <p className="text-slate-600 leading-relaxed">
                    We rebranded to <strong>Stories by Foot</strong> to reflect our deeper mission. We weren't just booking trips, we were crafting unforgettable narratives. Every mountain pass, every sunset, every conversation becomes a chapter in your story.
                  </p>

                  <div className="bg-white rounded-xl p-6 border border-orange-200 shadow-sm">
                    <p className="text-slate-600 italic leading-relaxed">
                      Walk the road. Live the story.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Story</h2>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                Every great adventure begins with a simple idea. For us, it started in <strong>October 2020</strong> with a vision: what if travel wasn't just about checking off destinations on a map, but about creating meaningful stories that stay with you forever?
              </p>

              <p>
                Born from the rebranding of <strong>PlanYorTrip</strong>, Stories by Foot transformed a traditional travel booking service into something far more profound a community of storytellers, adventurers, and explorers who believe that the best journeys are the ones that change you.
              </p>

              <p>
                Starting with the majestic mountains of <strong>Ladakh and Zanskar</strong>, we crafted the first expeditions with meticulous attention to detail. Each route was designed not just for thrills, but for connection with landscapes, cultures, and fellow travelers. We listened to every rider, every traveler, and we learned what it takes to create an unforgettable experience.
              </p>

              <p>
                From the misty hills of <strong>Meghalaya</strong> to the spiritual peaks of <strong>Tawang</strong>, from the stunning valleys of <strong>Bhutan</strong> to the remote trails of <strong>Upper Mustang</strong>, we expanded our footprint across six breathtaking regions spanning three countries. Along the way, we completed <strong>500+ expeditions</strong> and welcomed over <strong>10,000+ travelers</strong> from around the world.
              </p>

              <p>
                But numbers alone don't tell our story. What truly defines Stories by Foot is the trust you place in us, the friendships formed on mountain passes, the cultural connections made in remote villages, and the personal transformations that happen when you step out of your comfort zone and into the unknown.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <h4 className="text-xl font-bold text-orange-900 mb-2">500+</h4>
              <p className="text-orange-800">Expertly curated expeditions across diverse terrains and climates</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <h4 className="text-xl font-bold text-blue-900 mb-2">10,000+</h4>
              <p className="text-blue-800">Happy travelers from 20+ countries who've written their stories with us</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
              <h4 className="text-xl font-bold text-emerald-900 mb-2">6 Regions</h4>
              <p className="text-emerald-800">Connected by mountains, bound by stories, united by adventure</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 md:px-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-white text-3xl font-bold mb-12">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className={`relative group overflow-hidden rounded-xl bg-gradient-to-br ${stat.color} p-6 text-white shadow-lg transform transition hover:scale-105`}>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition"></div>
                  <div className="relative z-10">
                    <Icon className="h-8 w-8 mb-3 opacity-80" />
                    {stat.label === "Founded" ? (
                      <div className="text-4xl font-black mb-1">{stat.number}</div>
                    ) : (
                      <AnimatedNumber endString={stat.number} />
                    )}
                    <div className="text-sm font-semibold opacity-90">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Vision & Mission */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <AnimatedSection className="relative" animationClass="animate-in fade-in slide-in-from-left-8 duration-1000 fill-mode-both">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-400 rounded-full opacity-20"></div>
              <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
                <h3 className="text-3xl font-bold text-orange-900 mb-4">Our Vision</h3>
                <div className="text-orange-800 text-lg leading-relaxed space-y-3">
                  <p>
                    To redefine adventure travel and inspire a generation of conscious explorers who understand that the best journeys transform not just the places they visit, but the people they become.
                  </p>
                  <p>
                    We envision a world where adventure is accessible to everyone regardless of budget, fitness level, or background and where travel creates positive ripples across cultures, ecosystems, and communities.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection className="relative" animationClass="animate-in fade-in slide-in-from-right-8 duration-1000 fill-mode-both">
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-400 rounded-full opacity-20"></div>
              <div className="relative bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 border border-indigo-200">
                <h3 className="text-3xl font-bold text-indigo-900 mb-4">Our Mission</h3>
                <div className="text-indigo-800 text-lg leading-relaxed space-y-3">
                  <p>
                    To design authentic, responsible, and unforgettable journeys that blend thrilling adventure with genuine cultural immersion and uncompromising comfort.
                  </p>
                  <p>
                    We achieve this through meticulous route planning, deep partnerships with local communities, industry leading safety standards, and an unwavering commitment to environmental sustainability and cultural respect.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Stories by Foot */}
      <section className="py-20 px-6 md:px-12 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Why Explore with Stories by Foot?</h2>
            <p className="text-xl text-slate-600">We don't just take you places. We take you home forever.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {whyUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className={`${item.bg} border ${item.border} rounded-xl p-8 transform transition hover:scale-105 hover:shadow-lg`}>
                  <div className={`${item.color} mb-4`}>
                    <Icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">Our Journey</h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 via-indigo-400 to-pink-400 transform md:-translate-x-1/2"></div>

            <div className="space-y-12">
              {journey.map((item, idx) => (
                <div key={idx} className={`relative ${idx % 2 === 0 ? "md:mr-auto" : "md:ml-auto"} md:w-1/2 ${idx % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                  <div className="absolute left-0 top-0 w-4 h-4 bg-white border-4 border-orange-400 rounded-full transform -translate-x-1.5 md:-left-2"></div>
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200 hover:shadow-lg transition">
                    <span className="text-sm font-bold text-orange-600">{item.year}</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">{item.title}</h3>
                    <p className="text-slate-600 mt-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-12 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-3xl mx-auto relative z-10 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Write Your Story?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            Join thousands of explorers who've discovered that the best journeys aren't just about the destination they're about the stories you collect along the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/destinations"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white text-red-500 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition"
            >
              Browse Expeditions
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-white text-white font-bold text-lg hover:bg-white hover:bg-opacity-10 transition"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
