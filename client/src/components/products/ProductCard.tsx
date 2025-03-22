import { Link } from "wouter";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity: 1,
    });
  };

  return (
    <Card className="overflow-hidden group h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <a>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </a>
        </Link>
        <Button
          onClick={handleAddToCart}
          size="icon"
          className="absolute bottom-4 right-4 bg-white text-primary rounded-full shadow-md hover:bg-primary-50 transition"
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <Link href={`/products/${product.id}`}>
            <a className="text-lg font-medium text-gray-900 hover:text-primary">
              {product.name}
            </a>
          </Link>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm text-gray-600">{product.rating}</span>
          </div>
        </div>
        <p className="mt-1 text-gray-500 text-sm line-clamp-2 flex-grow">
          {product.description}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            Add to cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
