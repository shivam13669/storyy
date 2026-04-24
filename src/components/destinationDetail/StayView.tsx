import { ItineraryDay } from "@/data/destinations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Star, MapPin, LogIn, LogOut, Moon } from "lucide-react";

interface StayViewProps {
  itinerary?: ItineraryDay[];
}

const StayView = ({ itinerary = [] }: StayViewProps) => {
  // Extract unique accommodations
  const accommodations = itinerary
    .filter((day) => day.stay)
    .reduce((acc, day) => {
      if (day.stay) {
        const existing = acc.find((a) => a.name === day.stay!.name);
        if (existing) {
          existing.nights += day.stay.nights;
          existing.days.push(day.day);
        } else {
          acc.push({
            name: day.stay.name,
            stars: day.stay.stars,
            checkIn: day.stay.checkIn,
            checkOut: day.stay.checkOut,
            nights: day.stay.nights,
            images: day.stay.images,
            days: [day.day],
          });
        }
      }
      return acc;
    }, [] as Array<{
      name: string;
      stars: number;
      checkIn: string;
      checkOut: string;
      nights: number;
      images: string[];
      days: number[];
    }>);

  // Calculate total nights
  const totalNights = accommodations.reduce((sum, acc) => sum + acc.nights, 0);

  if (accommodations.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Accommodation</h3>
              <p className="text-muted-foreground text-sm">
                No accommodation details available for this package.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Accommodation Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Stay Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="border-l-2 border-primary pl-4">
              <p className="text-sm text-muted-foreground">Total Nights</p>
              <p className="text-2xl font-bold text-primary">{totalNights}</p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <p className="text-sm text-muted-foreground">Properties</p>
              <p className="text-2xl font-bold text-primary">{accommodations.length}</p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="text-2xl font-bold text-primary">
                4.5
                <span className="text-xs ml-1">★</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stay Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Where You'll Stay</h3>
        {accommodations.map((accommodation, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-base">{accommodation.name}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: accommodation.stars }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {accommodation.nights} night{accommodation.nights > 1 ? 's' : ''}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Images */}
              {accommodation.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {accommodation.images.slice(0, 3).map((image, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={image}
                      alt={`${accommodation.name} - Image ${imgIndex + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              {/* Check-in/Check-out */}
              <div className="bg-secondary/50 rounded p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <LogIn className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase">Check-in</p>
                    <p className="text-foreground font-medium">{accommodation.checkIn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase">Check-out</p>
                    <p className="text-foreground font-medium">{accommodation.checkOut}</p>
                  </div>
                </div>
              </div>

              {/* Which Days */}
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">Days</p>
                <p className="text-foreground">
                  Day{accommodation.days.length > 1 ? 's' : ''} {accommodation.days.join(', ')}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Important Stay Information */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-base">Accommodation Details</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            🏨 <strong>Room Type:</strong> Standard rooms by default (double sharing unless specified)
          </p>
          <p>
            🛏️ <strong>Amenities:</strong> Vary by property. Check specific hotel reviews for details.
          </p>
          <p>
            📝 <strong>Special Requests:</strong> Please mention any special requirements during booking.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StayView;
