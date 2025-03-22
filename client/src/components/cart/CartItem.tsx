import { useState } from "react";
import { Link } from "wouter";
import { CartItemWithProduct } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Minus } from "lucide-react";

interface CartItemProps {
  item: CartItemWithProduct;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateCartItem, removeCartItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleIncrement = () => {
    setIsUpdating(true);
    updateCartItem({ id: item.id, quantity: item.quantity + 1 });
    setIsUpdating(false);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      setIsUpdating(true);
      updateCartItem({ id: item.id, quantity: item.quantity - 1 });
      setIsUpdating(false);
    } else {
      handleRemove();
    }
  };

  const handleRemove = () => {
    removeCartItem(item.id);
  };

  return (
    <div className="py-6 flex border-b border-gray-200">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img 
          src={item.product.imageUrl} 
          alt={item.product.name} 
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="ml-4 flex-1 flex flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <Link href={`/products/${item.product.id}`} className="hover:text-primary">
                <a>{item.product.name}</a>
              </Link>
            </h3>
            <p className="ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-1">{item.product.description}</p>
        </div>
        <div className="flex-1 flex items-end justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleDecrement} 
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full p-0" 
              disabled={isUpdating}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-gray-500">{item.quantity}</span>
            <Button 
              onClick={handleIncrement} 
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full p-0" 
              disabled={isUpdating}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex">
            <Button 
              onClick={handleRemove} 
              variant="ghost" 
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              <Trash className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
