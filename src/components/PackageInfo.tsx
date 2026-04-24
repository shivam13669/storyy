import { Car, Building2, Coffee, MapPin } from "lucide-react";
import { ItineraryDay } from "@/data/destinations";

interface PackageInfoProps {
  duration: string;
  title: string;
  itinerary?: ItineraryDay[];
}

// Helper function to extract day count from duration string
const extractDayCount = (duration: string): number => {
  const match = duration.match(/(\d+)\s*d/i);
  return match ? parseInt(match[1]) : 0;
};

// Helper function to extract locations and count days in each
const extractLocationBreakdown = (itinerary?: ItineraryDay[]): Array<{ location: string; days: number }> => {
  if (!itinerary || itinerary.length === 0) return [];

  const locationMap = new Map<string, number>();

  itinerary.forEach((day) => {
    if (day.location) {
      locationMap.set(day.location, (locationMap.get(day.location) || 0) + 1);
    }
  });

  // Return locations in order of first appearance with their day counts
  const locations: Array<{ location: string; days: number }> = [];
  const seen = new Set<string>();

  itinerary.forEach((day) => {
    if (day.location && !seen.has(day.location)) {
      locations.push({
        location: day.location,
        days: locationMap.get(day.location) || 0,
      });
      seen.add(day.location);
    }
  });

  return locations;
};

const PackageInfo = ({ duration, title, itinerary }: PackageInfoProps) => {
  const dayCount = extractDayCount(duration);
  const locationBreakdown = extractLocationBreakdown(itinerary);

  // Fallback to primary/secondary split if no itinerary
  const primaryDays = Math.ceil(dayCount / 2);
  const secondaryDays = dayCount - primaryDays;

  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
        {title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <span className="badge-duration">{duration}</span>
        {locationBreakdown.length > 0 ? (
          locationBreakdown.map((location, index) => (
            <div key={index} className="flex items-center gap-1">
              <span className="text-3xl font-bold text-foreground">{location.days}</span>
              <div className="text-sm">
                <span className="text-muted-foreground">{location.days === 1 ? "Night in" : "Nights in"}</span>
                <p className="font-semibold text-foreground">{location.location}</p>
              </div>
            </div>
          ))
        ) : (
          <>
            {primaryDays > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-3xl font-bold text-foreground">{primaryDays}</span>
                <div className="text-sm">
                  <span className="text-muted-foreground">{primaryDays === 1 ? "Night in" : "Nights in"}</span>
                  <p className="font-semibold text-foreground">Primary Destination</p>
                </div>
              </div>
            )}
            {secondaryDays > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-3xl font-bold text-foreground">{secondaryDays}</span>
                <div className="text-sm">
                  <span className="text-muted-foreground">{secondaryDays === 1 ? "Night in" : "Nights in"}</span>
                  <p className="font-semibold text-foreground">Secondary Destination</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex flex-wrap gap-6 md:gap-10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Car className="w-5 h-5" />
            <span className="text-sm font-medium">Group Departure</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="w-5 h-5" />
            <span className="text-sm font-medium">Stay Included</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Coffee className="w-5 h-5" />
            <span className="text-sm font-medium">Breakfast & Dinner Included</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-medium">Sightseeing Included</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageInfo;
