import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { FilterState } from "./FilterSidebar";
import { getAvailableCategories, getCategoryPackageCounts, categoryIconMap } from "@/data/destinations";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const PRICE_RANGES = ["All", "₹0 - ₹25,000", "₹25,000 - ₹40,000", "₹40,000+"];
const RATINGS = ["All", "4.5+", "4.7+", "4.8+"];
const MIN_PRICE = 0;
const MAX_PRICE = 100000;

export const MobileFilterDrawer = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}: MobileFilterDrawerProps) => {
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

  const handleCategoryChange = (cat: string) => {
    onFiltersChange({
      ...filters,
      category: cat,
    });
  };

  const handlePriceRangeChange = (range: string) => {
    onFiltersChange({
      ...filters,
      priceRange: range,
    });
  };

  const handleRatingChange = (rating: string) => {
    onFiltersChange({
      ...filters,
      rating: rating,
    });
  };

  const handlePriceSliderChange = (values: number[]) => {
    if (values.length === 2) {
      onFiltersChange({
        ...filters,
        minPrice: values[0],
        maxPrice: values[1],
      });
    }
  };

  const handleReset = () => {
    onFiltersChange({
      search: "",
      category: "All",
      priceRange: "All",
      minPrice: 0,
      maxPrice: 100000,
      rating: "All",
    });
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

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center justify-center h-10 w-10 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold flex-1">Filters</h2>
        </div>

        <div className="p-4 space-y-6">
          {/* Category Filter */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Category</h3>
            <div className="flex flex-wrap gap-2">
              {getAvailableCategories().map((cat) => {
                const counts = getCategoryPackageCounts();
                const count = counts[cat] || 0;
                const isSelected = filters.category === cat;
                const icon = categoryIconMap[cat] || "•";

                return (
                  <input
                    key={cat}
                    type="radio"
                    id={`mobile-category-${cat}`}
                    name="category"
                    checked={isSelected}
                    onChange={() => handleCategoryChange(cat)}
                    className="sr-only"
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {getAvailableCategories().map((cat) => {
                const isSelected = filters.category === cat;
                const icon = categoryIconMap[cat] || "•";

                return (
                  <label
                    key={cat}
                    htmlFor={`mobile-category-${cat}`}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                        : "bg-white text-foreground border-gray-200 hover:border-primary/30 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-base">{icon}</span>
                    <span className="text-xs font-medium">{cat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Price Range</h3>
            <select
              value={filters.priceRange}
              onChange={(e) => handlePriceRangeChange(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm mb-4"
            >
              {PRICE_RANGES.map((price) => (
                <option key={price} value={price}>
                  {price}
                </option>
              ))}
            </select>

            <div className="mt-4">
              <label className="block text-xs font-medium text-muted-foreground mb-3">
                Custom Range: ₹{filters.minPrice.toLocaleString()} - ₹{filters.maxPrice.toLocaleString()}
              </label>
              <Slider
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={1000}
                value={[filters.minPrice, filters.maxPrice]}
                onValueChange={handlePriceSliderChange}
                className="w-full"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Rating</h3>
            <select
              value={filters.rating}
              onChange={(e) => handleRatingChange(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
            >
              {RATINGS.map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            className="flex-1 bg-orange-500 hover:bg-orange-600"
            onClick={onClose}
          >
            Apply
          </Button>
        </div>
      </div>
    </>
  );
};
