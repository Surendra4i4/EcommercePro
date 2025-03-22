import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
}

export interface FilterState {
  searchQuery: string;
  category: string;
  priceRange: string;
  sortBy: string;
}

export function ProductFilters({ onFilterChange, categories }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    category: "all",
    priceRange: "all",
    sortBy: "featured"
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters: FilterState = {
      searchQuery: "",
      category: "all",
      priceRange: "all",
      sortBy: "featured"
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = filters.searchQuery || filters.category !== "all" || filters.priceRange !== "all";

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        {/* Search bar */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search products..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          <div className="w-full sm:w-auto">
            <Select 
              value={filters.category} 
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="bg-gray-100">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto">
            <Select 
              value={filters.priceRange} 
              onValueChange={(value) => handleFilterChange("priceRange", value)}
            >
              <SelectTrigger className="bg-gray-100">
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under50">Under $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="100-200">$100 - $200</SelectItem>
                <SelectItem value="over200">Over $200</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Sort */}
        <div className="w-full sm:w-auto">
          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => handleFilterChange("sortBy", value)}
          >
            <SelectTrigger className="bg-gray-100">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="priceLow">Price: Low to High</SelectItem>
              <SelectItem value="priceHigh">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          {filters.category !== "all" && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}
              <button 
                onClick={() => handleFilterChange("category", "all")}
                className="ml-1 hover:text-primary/80"
              >
                <X size={14} />
              </button>
            </Badge>
          )}
          
          {filters.priceRange !== "all" && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {filters.priceRange === "under50" && "Under $50"}
              {filters.priceRange === "50-100" && "$50 - $100"}
              {filters.priceRange === "100-200" && "$100 - $200"}
              {filters.priceRange === "over200" && "Over $200"}
              <button 
                onClick={() => handleFilterChange("priceRange", "all")}
                className="ml-1 hover:text-primary/80"
              >
                <X size={14} />
              </button>
            </Badge>
          )}
          
          {filters.searchQuery && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Search: {filters.searchQuery}
              <button 
                onClick={() => handleFilterChange("searchQuery", "")}
                className="ml-1 hover:text-primary/80"
              >
                <X size={14} />
              </button>
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-gray-500 text-xs hover:text-primary"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
