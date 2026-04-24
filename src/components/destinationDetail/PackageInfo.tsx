import { Car, Building2, Coffee, MapPin } from "lucide-react";

interface PackageInfoProps {
  duration: string;
  title: string;
}

const PackageInfo = ({ duration, title }: PackageInfoProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
        {title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <span className="badge-duration">{duration}</span>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex flex-wrap gap-6 md:gap-10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Car className="w-5 h-5" />
            <span className="text-sm font-medium">Transfer Included</span>
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
