import { Plane, Building2, Bus, Compass } from "lucide-react";

const tabs = [
  { id: "itinerary", label: "Itinerary", icon: null },
  { id: "summarised", label: "Summarised View", icon: null },
  { id: "activities", label: "Activities", icon: Compass },
  { id: "flights", label: "Flights", icon: Plane },
  { id: "stay", label: "Stay", icon: Building2 },
  { id: "transfers", label: "Transfers", icon: Bus },
];

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="sticky top-[57px] z-40 bg-background py-3 -mx-4 px-4 mb-6 border-b border-border">
      <div className="flex gap-2 overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all flex-shrink-0 snap-center ${
              activeTab === tab.id
                ? "tab-active"
                : "tab-inactive"
            }`}
          >
            {tab.icon && <tab.icon className="w-4 h-4" />}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
