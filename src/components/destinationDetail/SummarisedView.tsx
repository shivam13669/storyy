import { ItineraryDay } from "@/data/destinations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummarisedViewProps {
  itinerary?: ItineraryDay[];
  highlights: string[];
  duration: string;
}

const SummarisedView = ({ itinerary = [], highlights, duration }: SummarisedViewProps) => {
  const daysCount = itinerary.length;

  // Extract unique locations from itinerary
  const locations = Array.from(
    new Set(itinerary.map((day) => day.location).filter(Boolean))
  );

  // Extract activities from all days
  const allActivities = itinerary.flatMap((day) => day.highlights || []);

  return (
    <div className="space-y-6">
      {/* Quick Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border-l-2 border-primary pl-4">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-lg font-semibold">{duration}</p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <p className="text-sm text-muted-foreground">Days</p>
              <p className="text-lg font-semibold">{daysCount}</p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <p className="text-sm text-muted-foreground">Locations</p>
              <p className="text-lg font-semibold">{locations.length}</p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <p className="text-sm text-muted-foreground">Activities</p>
              <p className="text-lg font-semibold">{allActivities.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locations Covered */}
      {locations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Locations Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {locations.map((location, index) => (
                <span
                  key={index}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium"
                >
                  {location}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trip Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-primary font-semibold mt-1">•</span>
                <span className="text-foreground">{highlight}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Day by Day Summary */}
      {itinerary.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Day by Day Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {itinerary.map((day) => (
                <div key={day.day} className="pb-4 border-b border-border last:border-b-0">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                        {day.day}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{day.title}</h4>
                      {day.location && (
                        <p className="text-sm text-muted-foreground mt-1">{day.location}</p>
                      )}
                      <p className="text-sm text-foreground mt-2">{day.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SummarisedView;
