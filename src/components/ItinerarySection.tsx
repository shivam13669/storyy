import ItineraryCarousel from "./ItineraryCarousel";
import ItineraryDay from "./ItineraryDay";
import type { ItineraryDay as ItineraryDayType } from "@/data/destinations";

interface ItinerarySectionProps {
  images: string[];
  days: number;
  itinerary?: ItineraryDayType[];
}

const ItinerarySection = ({ images, days, itinerary }: ItinerarySectionProps) => {
  // Use provided itinerary data or create sample data
  const itineraryDays = itinerary || Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    title: i === 0 ? "Arrival & Orientation" : i === days - 1 ? "Departure" : `Explore & Experience Day ${i}`,
    description:
      i === 0
        ? "Welcome to the destination! Get settled, explore the local area, and prepare for the adventure ahead."
        : i === days - 1
        ? "Enjoy your last moments before departure. Transfer to airport with unforgettable memories."
        : `Dive into local culture, explore scenic landscapes, and create unforgettable memories.`,
  }));

  // Split into 2 locations: first half and second half
  const midpoint = Math.ceil(itineraryDays.length / 2);
  const firstLocationDays = itineraryDays.slice(0, midpoint);
  const secondLocationDays = itineraryDays.slice(midpoint);

  return (
    <div>
      {/* First Location */}
      {firstLocationDays.length > 0 && (
        <div>
          {firstLocationDays.map((item) => (
            <ItineraryDay
              key={item.day}
              day={item.day}
              title={item.title}
              description={item.description}
              highlights={item.highlights}
              location={item.location}
              transfer={item.transfer}
              stay={item.stay}
            />
          ))}
        </div>
      )}

      {/* Second Location */}
      {secondLocationDays.length > 0 && (
        <div>
          {secondLocationDays.map((item) => (
            <ItineraryDay
              key={item.day}
              day={item.day}
              title={item.title}
              description={item.description}
              highlights={item.highlights}
              location={item.location}
              transfer={item.transfer}
              stay={item.stay}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default ItinerarySection;
