import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { ProductFilters, FilterState } from "@/components/product-filters";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, CheckCircle, RefreshCw, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    category: "all",
    priceRange: "all",
    sortBy: "featured"
  });

  // Get URL parameters for initial filters
  const queryParams = new URLSearchParams(window.location.search);
  const searchParam = queryParams.get("search");
  const categoryParam = queryParams.get("category");

  // Set initial filters from URL parameters
  useEffect(() => {
    if (searchParam || categoryParam) {
      setFilters(prev => ({
        ...prev,
        searchQuery: searchParam || "",
        category: categoryParam || "all"
      }));
    }
  }, [searchParam, categoryParam]);

  // Fetch products
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Failed to load products</h2>
            <p className="text-gray-600 mb-6">There was an error loading the products. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter and sort products based on current filters
  const filteredProducts = products?.filter((product) => {
    // Filter by search query
    if (filters.searchQuery && !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (filters.category !== "all" && product.category !== filters.category) {
      return false;
    }
    
    // Filter by price
    const price = parseFloat(product.price.toString());
    if (filters.priceRange === "under50" && price >= 50) {
      return false;
    } else if (filters.priceRange === "50-100" && (price < 50 || price > 100)) {
      return false;
    } else if (filters.priceRange === "100-200" && (price < 100 || price > 200)) {
      return false;
    } else if (filters.priceRange === "over200" && price <= 200) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort products
    const priceA = parseFloat(a.price.toString());
    const priceB = parseFloat(b.price.toString());
    const ratingA = parseFloat(a.rating.toString());
    const ratingB = parseFloat(b.rating.toString());
    
    if (filters.sortBy === "priceLow") {
      return priceA - priceB;
    } else if (filters.sortBy === "priceHigh") {
      return priceB - priceA;
    } else if (filters.sortBy === "rating") {
      return ratingB - ratingA;
    }
    
    // Default: featured/newest
    return 0;
  });

  // Get unique categories for filters
  const categories = products ? Array.from(new Set(products.map(p => p.category))) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary-50 py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Shop the Latest <span className="text-primary">Trends</span>
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                  Discover premium products at affordable prices. From electronics to home decor, we've got everything you need.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} size="lg" className="gap-2">
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg">
                    View Categories
                  </Button>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                    alt="Electronics collection display"
                    className="rounded-lg shadow-lg"
                    width="600"
                    height="400"
                  />
                  <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-lg shadow-md hidden lg:block">
                    <div className="flex items-center space-x-2">
                      <div className="bg-green-500 text-white p-2 rounded-full">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Fast Delivery</p>
                        <p className="text-sm text-gray-500">2-3 Business Days</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-5 -right-5 bg-white p-4 rounded-lg shadow-md hidden lg:block">
                    <div className="flex items-center space-x-2">
                      <div className="bg-blue-500 text-white p-2 rounded-full">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Secure Payment</p>
                        <p className="text-sm text-gray-500">100% Safe Checkout</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <div key={category} className="group cursor-pointer" onClick={() => setLocation(`/?category=${category}`)}>
                  <div className="bg-gray-100 rounded-lg p-6 text-center transition-all hover:bg-primary-50 hover:shadow-md">
                    <div className="bg-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                      {category === 'electronics' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="2" x2="9" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="22"/><line x1="15" y1="20" x2="15" y2="22"/><line x1="20" y1="9" x2="22" y2="9"/><line x1="20" y1="14" x2="22" y2="14"/><line x1="2" y1="9" x2="4" y2="9"/><line x1="2" y1="14" x2="4" y2="14"/></svg>}
                      {category === 'furniture' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 8h-8a2 2 0 0 0-2 2v8"/><path d="M6 2v12"/><path d="M2 14h16"/><path d="M18 6V2"/><path d="M22 14h-4"/><path d="M18 22v-8"/><path d="M6 18a4 4 0 0 1-4-4"/><path d="M14 22v-4"/></svg>}
                      {category === 'home' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                      {category === 'kitchen' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v10c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V7"/><path d="M10 3h4"/><path d="M10 3v4"/><path d="M14 3v4"/><path d="M3 7h18"/></svg>}
                    </div>
                    <h3 className="font-medium text-gray-800 capitalize">{category}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {products ? products.filter(p => p.category === category).length : 0} Products
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Products</h2>
            <p className="text-gray-600 mb-8">Discover our wide range of high-quality products</p>
            
            {/* Filters & Sorting */}
            <ProductFilters 
              onFilterChange={setFilters} 
              categories={categories}
            />
            
            {/* Product grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
                
                {/* Empty state */}
                {filteredProducts?.length === 0 && (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center">
                    <div className="bg-gray-100 rounded-full p-4 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4 text-center">Try adjusting your filters or search query</p>
                    <Button 
                      onClick={() => setFilters({
                        searchQuery: "",
                        category: "all",
                        priceRange: "all",
                        sortBy: "featured"
                      })}
                      variant="outline"
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary-50 text-primary rounded-full p-4 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 14 2.5-2.5C11.3 10.7 12.5 10 14 10c1 0 1.7.5 2 1.2"/><path d="M12 8v1"/><path d="M12 14v2"/></svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Free Shipping</h3>
                <p className="text-gray-600">Free shipping on all orders over $100. We deliver to your doorstep.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary-50 text-primary rounded-full p-4 mb-4">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Easy Returns</h3>
                <p className="text-gray-600">Changed your mind? Return products within 30 days for a full refund.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary-50 text-primary rounded-full p-4 mb-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Secure Payment</h3>
                <p className="text-gray-600">Your payment information is processed securely. We don't store card details.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
