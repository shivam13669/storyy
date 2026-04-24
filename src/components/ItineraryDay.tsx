import { useState } from "react";
import { ChevronDown, ChevronUp, Bus, MapPin, Building2, Star } from "lucide-react";

interface TransferInfo {
  type: string;
  vehicle: string;
  from: string;
  to: string;
  stops?: number;
}

interface StayInfo {
  name: string;
  stars: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  images: string[];
}

interface Experience {
  image: string;
  title: string;
}

interface ItineraryDayProps {
  day: number;
  title: string;
  description?: string;
  transfer?: TransferInfo;
  stay?: StayInfo;
  experiences?: Experience[];
  highlights?: string[];
  location?: string;
}

const ItineraryDay = ({ day, title, description, transfer, stay, experiences, highlights, location }: ItineraryDayProps) => {
  const [isOpen, setIsOpen] = useState(day === 1);

  return (
    <div className="border border-border rounded-lg mb-3 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="badge-day">DAY {day}</span>
          <span className="font-medium text-foreground">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="px-5 pb-5 space-y-6">
          {/* Description */}
          {description && (
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          )}

          {/* Highlights Section */}
          {highlights && highlights.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Highlights</h4>
              <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                {highlights.map((highlight, idx) => (
                  <li key={idx} className="text-sm">{highlight}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Transfer Section */}
          {transfer && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Bus className="w-4 h-4" />
                <span className="text-sm">{transfer.type}</span>
              </div>
              <h4 className="font-semibold text-foreground">Transfer in {transfer.vehicle}</h4>

              <div className="relative pl-6 space-y-4">
                {/* From */}
                <div className="relative">
                  <div className="absolute left-[-24px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <span className="text-xs text-primary font-medium">From</span>
                  <div className="border border-border rounded-lg p-3 mt-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">{transfer.from}</span>
                    </div>
                  </div>
                </div>

                {/* Connecting line */}
                <div className="absolute left-[-16px] top-8 bottom-8 w-0.5 bg-border" />

                {/* Stops */}
                {(transfer.stops ?? 0) > 0 && (
                  <div className="text-center">
                    <a href="#" className="text-primary text-sm hover:underline">↕ View {transfer.stops} Stop{transfer.stops > 1 ? 's' : ''}</a>
                  </div>
                )}

                {/* To */}
                <div className="relative">
                  <div className="absolute left-[-24px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <span className="text-xs text-primary font-medium">To</span>
                  <div className="border border-border rounded-lg p-3 mt-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">{transfer.to}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stay Section */}
          {stay && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">Stay At</span>
              </div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">Stay At {stay.name}</h4>
                <div className="flex">
                  {[...Array(stay.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {stay.images.slice(0, 3).map((img, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden h-24">
                    <img src={img} alt="Stay" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Check-in</span>
                  <p className="font-medium text-foreground">{stay.checkIn}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Check-out</span>
                  <p className="font-medium text-foreground">{stay.checkOut}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration</span>
                  <p className="font-medium text-foreground">{stay.nights} night{stay.nights > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          )}

          {/* Experiences Section */}
          {experiences && experiences.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Experiences</h4>
              <div className="grid grid-cols-2 gap-3">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden h-32">
                    <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <p className="text-primary-foreground text-sm font-medium p-2">{exp.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItineraryDay;
