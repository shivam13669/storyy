import { ItineraryDay } from "@/data/destinations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, MapPin, Route, AlertCircle } from "lucide-react";

interface TransfersViewProps {
  itinerary?: ItineraryDay[];
}

const TransfersView = ({ itinerary = [] }: TransfersViewProps) => {
  // Filter out airport transfers (already in flights)
  const transferDays = itinerary.filter(
    (day) =>
      day.transfer &&
      !day.transfer.type.toLowerCase().includes("airport")
  );

  // Group transfers by type
  const transfersByType = transferDays.reduce((acc, day) => {
    const type = day.transfer!.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(day);
    return acc;
  }, {} as Record<string, ItineraryDay[]>);

  if (transferDays.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Bus className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Transfers</h3>
              <p className="text-muted-foreground text-sm">
                No transfer details available for this package.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Transfers Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bus className="w-5 h-5" />
            Transport Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="border-l-2 border-primary pl-4">
              <p className="text-sm text-muted-foreground">Total Transfers</p>
              <p className="text-2xl font-bold text-primary">{transferDays.length}</p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <p className="text-sm text-muted-foreground">Transfer Types</p>
              <p className="text-2xl font-bold text-primary">{Object.keys(transfersByType).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Details by Type */}
      {Object.entries(transfersByType).map(([type, days]) => (
        <div key={type} className="space-y-3">
          <h3 className="text-lg font-semibold capitalize">{type}</h3>
          <div className="grid grid-cols-1 gap-3">
            {days.map((day) => (
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
                      {/* Route */}
                      <div className="bg-secondary/50 rounded p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase">From</p>
                            <p className="text-foreground font-semibold">{day.transfer.from}</p>
                          </div>
                        </div>

                        <div className="flex justify-center mb-3">
                          <Route className="w-5 h-5 text-primary/50" />
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase">To</p>
                            <p className="text-foreground font-semibold">{day.transfer.to}</p>
                          </div>
                        </div>
                      </div>

                      {/* Vehicle Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase">Vehicle</p>
                          <p className="text-foreground font-medium">{day.transfer.vehicle}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase">Type</p>
                          <p className="text-foreground font-medium">{day.transfer.type}</p>
                        </div>
                      </div>

                      {/* Stops */}
                      {(day.transfer.stops ?? 0) > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-950 rounded p-3">
                          <p className="text-sm text-blue-900 dark:text-blue-100">
                            <strong>🛑 {day.transfer.stops} stop{day.transfer.stops > 1 ? 's' : ''}</strong> along the way
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Important Transfer Information */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Important Transfer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            🚗 <strong>Vehicle Types:</strong> Transfers are by the vehicle specified for each leg.
          </p>
          <p>
            ⏰ <strong>Timing:</strong> Transfers will be coordinated based on your itinerary schedule.
          </p>
          <p>
            🧳 <strong>Luggage:</strong> Reasonable luggage included. Contact for excess baggage charges.
          </p>
          <p>
            👨‍💼 <strong>Drivers:</strong> Experienced and knowledgeable drivers provided for all transfers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransfersView;
