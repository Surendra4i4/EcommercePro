import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export interface CartItem extends Omit<Product, 'stock'> {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  addItem: (product: Product, quantity?: number) => void;
  updateItemQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("shopease-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("shopease-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      toast({
        title: "Cannot add to cart",
        description: "This product is out of stock.",
        variant: "destructive",
      });
      return;
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Calculate the max quantity that can be added based on stock
        const maxAdditionalQuantity = Math.max(0, product.stock - existingItem.quantity);
        const actualQuantityToAdd = Math.min(quantity, maxAdditionalQuantity);
        
        // If we can't add any more, show an error
        if (actualQuantityToAdd <= 0) {
          toast({
            title: "Cannot add more",
            description: "You've reached the maximum available stock for this product.",
            variant: "destructive",
          });
          return prevItems;
        }
        
        // Update the quantity of the existing item
        const newQuantity = existingItem.quantity + actualQuantityToAdd;
        
        toast({
          title: "Added to cart",
          description: `Updated ${product.name} quantity to ${newQuantity}.`,
        });
        
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: newQuantity } 
            : item
        );
      } else {
        // Add a new item to the cart
        const actualQuantityToAdd = Math.min(quantity, product.stock);
        
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
        });
        
        const { stock, ...productWithoutStock } = product;
        return [...prevItems, { ...productWithoutStock, quantity: actualQuantityToAdd }];
      }
    });
  };

  const updateItemQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prevItems => {
      // Find the product to update
      const itemToUpdate = prevItems.find(item => item.id === id);
      if (!itemToUpdate) return prevItems;

      return prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
    });
  };

  const removeItem = (id: number) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === id);
      
      if (itemToRemove) {
        toast({
          title: "Removed from cart",
          description: `${itemToRemove.name} has been removed from your cart.`,
        });
      }
      
      return prevItems.filter(item => item.id !== id);
    });
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const cartTotal = () => {
    return items.reduce((total, item) => {
      return total + parseFloat(item.price.toString()) * item.quantity;
    }, 0);
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      addItem,
      updateItemQuantity,
      removeItem,
      clearCart,
      cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
