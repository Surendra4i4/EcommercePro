import { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { Heart, Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Format price as fixed 2 decimal places
  const formattedPrice = parseFloat(product.price.toString()).toFixed(2);
  
  // Parse rating for star display
  const rating = parseFloat(product.rating.toString());
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col h-full">
      {/* Wishlist button */}
      <button 
        onClick={() => setIsWishlisted(!isWishlisted)} 
        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm z-10 transition-colors"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart 
          size={18} 
          className={cn(
            "transition-colors",
            isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
          )} 
        />
      </button>
      
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Product details */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
            <h3 className="font-medium text-gray-800 hover:text-primary transition-colors">{product.name}</h3>
          </div>
        </div>
        
        <div className="flex items-center mb-2">
          <div className="flex text-amber-400">
            {[...Array(fullStars)].map((_, i) => (
              <Star key={`full-${i}`} size={14} className="fill-amber-400" />
            ))}
            
            {hasHalfStar && (
              <StarHalf key="half" size={14} className="fill-amber-400" />
            )}
            
            {[...Array(emptyStars)].map((_, i) => (
              <Star key={`empty-${i}`} size={14} className="text-gray-300" />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({rating})</span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
        
        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="font-bold text-gray-800">${formattedPrice}</p>
            {product.stock < 10 && (
              <p className="text-xs text-gray-500">
                {product.stock > 0 ? (
                  `Only ${product.stock} left`
                ) : (
                  <span className="text-red-500">Out of stock</span>
                )}
              </p>
            )}
          </div>
          
          <Button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
