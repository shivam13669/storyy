import { Check, X } from "lucide-react";

interface PackageInclusionsProps {
  inclusions?: string[];
  exclusions?: string[];
}

const defaultInclusions = [
  "Transfer from Keflavik International Airport to Hotel Reykjavik Grand",
  "3 nights stay in Reykjavik with breakfast",
  "Golden Circle Tour on a Shared basis",
  "Reykjavik Whale Watching Tour",
  "Transfer from Hotel Reykjavik Grand to Reykjavik Airport",
  "Flights included from Iceland to Akureyri",
  "Transfer from Akureyri Airport to Hotel Kjarnalundur, Akureyri",
  "3 nights stay in Akureyri with breakfast",
  "Diamond Circle Day Trip from Akureyri on a Shared basis",
  "Transfer from Hotel Kjarnalundur, Akureyri to Akureyri Airport",
  "Internal Flights",
  "Daily Breakfast",
  "Visa assistance",
];

const defaultExclusions = [
  "Expenses of a personal nature.",
  "Meals not mentioned in the itinerary or inclusions",
  "International flight tickets",
  "Lunch",
  "Dinner",
  "Travel Insurance",
];

const PackageInclusions = ({ inclusions, exclusions }: PackageInclusionsProps) => {
  const displayInclusions = inclusions || defaultInclusions;
  const displayExclusions = exclusions || defaultExclusions;
  return (
    <div className="border border-border rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-foreground mb-6 pb-4 border-b border-border">
        What's inside the package?
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inclusions */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Inclusions</h3>
          <ul className="space-y-3">
            {displayInclusions.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Exclusions */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Exclusions</h3>
          <ul className="space-y-3">
            {displayExclusions.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PackageInclusions;
