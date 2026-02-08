"use client";

import React, { useEffect, useRef } from "react";

const getInitials = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return `${first}${last}`.toUpperCase();
};

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Photographer",
    location: "New Delhi, India",
    trip: "Ladakh Himalayan Ride",
    quote:
      "StoriesByFoot turned the intimidating Himalayas into a dream ride. Every halt had hot chai, every route had a backup plan, and they never stopped surprising us with hidden gems.",
    highlight: "Altitude 17,982 ft",
    rating: 5,
  },
  {
    name: "Neha Kapoor",
    role: "Product Manager",
    location: "Bengaluru, India",
    trip: "Arunachal Riverine Expedition",
    quote:
      "From bamboo homestays to private rafting sessions, the itinerary was a perfect blend of thrill and serenity. Their crew felt like family by the end of the trip.",
    highlight: "8-day guided trail",
    rating: 5,
  },
  {
    name: "Kabir Singh",
    role: "Entrepreneur",
    location: "Mumbai, India",
    trip: "Spiti Valley Convoy",
    quote:
      "I have done a dozen driving expeditions, but none matched the precision of StoriesByFoot. The lead marshals navigated blizzards like pros and kept morale sky high.",
    highlight: "12 vehicles in convoy",
    rating: 4,
  },
  {
    name: "Lara Dsouza",
    role: "Yoga Instructor",
    location: "Goa, India",
    trip: "Sikkim Wellness Retreat",
    quote:
      "Sunrise meditations, organic breakfasts, and mindful hikes. They curated every little detail so I could focus on teaching and soaking in the mountains.",
    highlight: "Daily guided rituals",
    rating: 5,
  },
  {
    name: "Vikram Reddy",
    role: "Software Engineer",
    location: "Hyderabad, India",
    trip: "Rajasthan Desert Safari",
    quote:
      "Disconnecting from code and connecting with nature was exactly what I needed. The camel rides under starlit skies, bonfire stories, and the expertise of local guides made this journey truly magical.",
    highlight: "5-night desert camp",
    rating: 5,
  },
  {
    name: "Priya Malhotra",
    role: "Journalist",
    location: "Delhi, India",
    trip: "Northeast Stories Trail",
    quote:
      "As a travel writer, I've explored many regions, but the storytelling approach of StoriesByFoot was exceptional. They don't just guide you through destinations, they unveil the soul of each place through authentic local connections.",
    highlight: "Culture-immersive journey",
    rating: 5,
  },
];

const TestimonialsCarousel: React.FC = () => {
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tracks = trackRefs.current;

    const runners = tracks.map((track, i) => {
      if (!track) return null;

      let y = 0;
      const speed = 0.25 + i * 0.05;

      const run = () => {
        y += speed;
        if (y >= track.scrollHeight / 2) y = 0;
        track.style.transform = `translateY(-${y}px)`;
        return requestAnimationFrame(run);
      };

      return run();
    });

    return () => {
      runners.forEach((id) => {
        if (id !== null) cancelAnimationFrame(id);
      });
    };
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-background via-primary/5 to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Shared memories that stay
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from explorers who trusted StoriesByFoot for their unforgettable adventures.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((colIndex) => (
              <div key={colIndex} className={`h-[520px] overflow-hidden relative group ${colIndex > 0 ? 'hidden lg:block' : ''}`}>
                {/* Top fade */}
                <div className="absolute top-0 left-0 right-0 h-[70px] bg-gradient-to-b from-background via-background to-transparent z-10 pointer-events-none" />
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-[70px] bg-gradient-to-t from-background via-background to-transparent z-10 pointer-events-none" />

                <div
                  ref={(el) => {
                    trackRefs.current[colIndex] = el;
                  }}
                  className="flex flex-col gap-[18px]"
                >
                  {Array(testimonials.length * 2)
                    .fill(null)
                    .map((_, idx) => {
                      const offset = (colIndex * 2) % testimonials.length;
                      const testimonial = testimonials[(idx + offset) % testimonials.length];
                      return (
                        <div
                          key={`${colIndex}-${idx}`}
                          className="flex-shrink-0"
                          style={{
                            background: "linear-gradient(180deg,#ffffff 0%,#fbfefc 100%)",
                            padding: "22px",
                            borderRadius: "18px",
                            border: "1px solid rgba(34,197,94,.18)",
                            boxShadow: "0 10px 28px rgba(0,0,0,.10), inset 0 1px 0 rgba(255,255,255,.8)",
                          }}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <span style={{ fontSize: "30px", color: "#86efac", lineHeight: 1 }}>❝</span>
                            <span style={{ color: "#facc15", fontSize: "16px", letterSpacing: "2px" }}>
                              {Array(testimonial.rating).fill("★").join("")}
                            </span>
                          </div>

                          <p style={{ color: "#374151", lineHeight: 1.5, marginBottom: "12px" }}>
                            "{testimonial.quote}"
                          </p>

                          <div
                            style={{
                              display: "inline-block",
                              padding: "6px 12px",
                              borderRadius: "999px",
                              background: "#ecfdf5",
                              border: "1px solid #86efac",
                              color: "#16a34a",
                              fontSize: "12px",
                              marginBottom: "14px",
                            }}
                          >
                            {testimonial.trip}
                          </div>

                          <div className="flex items-center gap-3 mt-4">
                            <div
                              style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg,#22c55e,#4ade80)",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "600",
                              }}
                            >
                              {getInitials(testimonial.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div style={{ fontWeight: "600", color: "#111827" }}>
                                {testimonial.name}
                              </div>
                              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                                {testimonial.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
