import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCard from "./ProductCard";
import ProductFilter from "./ProductFilter";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  category?: string;
}

export default function ProductGrid({ category = "all" }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>(category);
  const [sortOption, setSortOption] = useState<string>("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", activeCategory !== "all" ? { category: activeCategory } : undefined],
  });

  const sortProducts = (products: Product[]) => {
    return [...products].sort((a, b) => {
      if (sortOption === "price-low") return a.price - b.price;
      if (sortOption === "price-high") return b.price - a.price;
      if (sortOption === "rating") return b.rating - a.rating;
      // Default: newest (by id, since we don't have a date in our mock data)
      return b.id - a.id;
    });
  };

  const filterProducts = (products: Product[]) => {
    return products.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
  };

  const displayedProducts = sortProducts(filterProducts(products));

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        {activeCategory === "all" ? "All Products" : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Products`}
      </h2>

      <ProductFilter
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        sortOption={sortOption}
        setSortOption={setSortOption}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <Skeleton className="h-64 w-full" />
              <div className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
