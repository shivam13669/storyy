import { ItineraryDay } from "@/data/destinations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass } from "lucide-react";

interface ActivitiesViewProps {
  itinerary?: ItineraryDay[];
}

const ActivitiesView = ({ itinerary = [] }: ActivitiesViewProps) => {
  // Extract all activities from all days
  const activitiesByDay = itinerary.map((day) => ({
    day: day.day,
    title: day.title,
    location: day.location,
    activities: day.highlights || [],
  }));

  // Create a flat list of all activities with deduplication
  const allActivitiesSet = new Set<string>();
  itinerary.forEach((day) => {
    day.highlights?.forEach((activity) => {
      allActivitiesSet.add(activity);
    });
  });
  const allActivities = Array.from(allActivitiesSet);

  return (
    <div className="space-y-6">
      {/* All Activities Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="w-5 h-5" />
            All Activities & Experiences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {allActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-2 bg-secondary/50 rounded">
                <span className="text-primary font-bold mt-0.5">✓</span>
                <span className="text-foreground text-sm">{activity}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activities by Day */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Activities by Day</h3>
        {activitiesByDay.map((dayActivities) => (
          dayActivities.activities.length > 0 && (
            <Card key={dayActivities.day}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {dayActivities.day}
                  </span>
                  <div>
                    <p className="text-base">{dayActivities.title}</p>
                    {dayActivities.location && (
                      <p className="text-xs text-muted-foreground font-normal mt-1">
                        📍 {dayActivities.location}
                      </p>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {dayActivities.activities.map((activity, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary text-lg leading-none">•</span>
                      <span className="text-foreground text-sm">{activity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        ))}
      </div>
    </div>
  );
};

export default ActivitiesView;
