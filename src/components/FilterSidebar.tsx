import { Search, Filter } from "lucide-react";
import { Slider } from "./ui/slider";
import { getAvailableCategories, getCategoryPackageCounts, categoryIconMap } from "@/data/destinations";
import { useRef } from "react";

export type FilterState = {
  search: string;
  category: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  rating: string;
};

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const PRICE_RANGES = ["All", "₹0 - ₹25,000", "₹25,000 - ₹40,000", "₹40,000+"];
const RATINGS = ["All", "4.5+", "4.7+", "4.8+"];
const MIN_PRICE = 0;
const MAX_PRICE = 100000;

export const FilterSidebar = ({ filters, onFiltersChange }: FilterSidebarProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      category: e.target.value,
    });
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      priceRange: e.target.value,
    });
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      rating: e.target.value,
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

  return (
    <div className="w-full lg:w-72">
      <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
        <h3 className="flex items-center gap-2 text-lg font-bold text-foreground mb-6">
          <Filter className="w-5 h-5" />
          Filters
        </h3>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full h-10 pl-9 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-3">
            Category
          </label>
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
                  id={`category-${cat}`}
                  name="category"
                  value={cat}
                  checked={isSelected}
                  onChange={handleCategoryChange}
                  className="sr-only peer"
                  aria-label={`${cat} category filter`}
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
                  htmlFor={`category-${cat}`}
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
        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-3">
            Price Range
          </label>
          <select
            value={filters.priceRange}
            onChange={handlePriceRangeChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm mb-4"
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
        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-3">
            Rating
          </label>
          <select
            value={filters.rating}
            onChange={handleRatingChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
          >
            {RATINGS.map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
