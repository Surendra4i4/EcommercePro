import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface ProductFilterProps {
  activeCategory: string;
  setActiveCategory: Dispatch<SetStateAction<string>>;
  sortOption: string;
  setSortOption: Dispatch<SetStateAction<string>>;
  priceRange: [number, number];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
}

export default function ProductFilter({
  activeCategory,
  setActiveCategory,
  sortOption,
  setSortOption,
  priceRange,
  setPriceRange,
}: ProductFilterProps) {
  const categories = [
    { id: "all", name: "All" },
    { id: "electronics", name: "Electronics" },
    { id: "furniture", name: "Furniture" },
    { id: "home", name: "Home" },
    { id: "clothing", name: "Clothing" },
    { id: "accessories", name: "Accessories" },
  ];

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  return (
    <Card className="bg-white shadow-sm mb-8">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className="px-3 py-1 h-8 text-sm rounded-full"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="w-full md:w-48">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </label>
          <div className="mt-2 px-2">
            <Slider
              defaultValue={[priceRange[0], priceRange[1]]}
              max={1000}
              step={10}
              onValueChange={handlePriceChange}
              className="mt-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
