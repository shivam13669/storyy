import { Heart, Star, Clock } from "lucide-react";

const badges = [
  {
    icon: Heart,
    title: "10K+",
    description: "Happy customers from 70+ countries all around.",
  },
  {
    icon: Star,
    title: "4.8/5",
    description: "Rated across Trip Advisor and Google.",
  },
  {
    icon: Heart,
    title: "Curated with love",
    description: "Special curated Indian Itineraries for Indians.",
  },
  {
    icon: Clock,
    title: "24/7 On-trip assistance",
    description: "We are always there to help you pre, post and on the trip.",
  },
];

const TrustBadges = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-t border-border">
      {badges.map((badge, index) => (
        <div key={index} className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            <badge.icon className="w-12 h-12 text-gold" strokeWidth={1.5} />
          </div>
          <h4 className="font-semibold text-foreground mb-1">{badge.title}</h4>
          <p className="text-sm text-muted-foreground">{badge.description}</p>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
