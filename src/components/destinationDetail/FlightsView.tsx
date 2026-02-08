import { ItineraryDay } from "@/data/destinations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, MapPin, Clock } from "lucide-react";

interface FlightsViewProps {
  itinerary?: ItineraryDay[];
}

const FlightsView = ({ itinerary = [] }: FlightsViewProps) => {
  // Extract flights/transfers that contain Airport or flight info
  const flightTransfers = itinerary.filter(
    (day) =>
      day.transfer &&
      (day.transfer.type.toLowerCase().includes("airport") ||
        day.transfer.type.toLowerCase().includes("flight") ||
        day.transfer.from.toLowerCase().includes("airport") ||
        day.transfer.to.toLowerCase().includes("airport"))
  );

  // If no flights found, show info message
  if (flightTransfers.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Flight Information</h3>
              <p className="text-muted-foreground text-sm">
                This trip includes airport transfers. International & Domestic flights are not included in the package.
                <br />
                <br />
                <strong>Note:</strong> Please book your flights independently.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5" />
            Flight & Airport Transfers
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 text-sm text-muted-foreground">
          International & Domestic flights are not included in the package. Please book your flights independently.
        </CardContent>
      </Card>

      {/* Flight/Airport Transfer Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Airport Transfers</h3>
        {flightTransfers.map((day) => (
          <Card key={day.day}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  {day.day}
                </span>
                <span>{day.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {day.transfer && (
                <div className="space-y-4">
                  <div className="bg-secondary/50 rounded p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-semibold uppercase">From</p>
                        <p className="text-foreground font-semibold">{day.transfer.from}</p>
                      </div>
                    </div>

                    <div className="flex justify-center mb-4">
                      <div className="text-primary font-bold">↓</div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-semibold uppercase">To</p>
                        <p className="text-foreground font-semibold">{day.transfer.to}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase">Vehicle</p>
                      <p className="text-foreground font-medium">{day.transfer.vehicle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase">Transfer Type</p>
                      <p className="text-foreground font-medium">{day.transfer.type}</p>
                    </div>
                  </div>

                  {(day.transfer.stops ?? 0) > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">
                        Stops
                      </p>
                      <p className="text-foreground">{day.transfer.stops} stop(s) along the way</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Important Notes */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-base">Important Information</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            ✈️ <strong>International & Domestic Flights:</strong> Not included in package price. Book separately.
          </p>
          <p>
            🚐 <strong>Airport Transfers:</strong> Included as mentioned in itinerary above.
          </p>
          <p>
            ⏰ <strong>Transfer Timing:</strong> Coordinated based on flight arrival/departure times.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlightsView;
