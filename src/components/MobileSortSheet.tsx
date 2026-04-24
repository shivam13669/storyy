import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface MobileSortSheetProps {
  isOpen: boolean;
  onClose: () => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
];

export const MobileSortSheet = ({
  isOpen,
  onClose,
  sortBy,
  onSortChange,
}: MobileSortSheetProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSortChange = (value: string) => {
    onSortChange(value);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Sort By</h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center h-10 w-10 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sort Options */}
          <div className="divide-y divide-gray-200">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition text-left"
              >
                <span className={`text-sm ${sortBy === option.value ? 'font-semibold text-primary' : 'text-gray-700'}`}>
                  {option.label}
                </span>
                {sortBy === option.value && (
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Padding for mobile */}
          <div className="h-4" />
        </div>
      </div>
    </>
  );
};
