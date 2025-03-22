import React from "react";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Plus, Minus, ShoppingCart, X, Trash2 } from "lucide-react";
import { CartItem } from "@/hooks/use-cart";
import { getInrFromUsd, formatUsd } from "@/lib/currency";

interface ShoppingCartProps {
  children: React.ReactNode;
}

export function ShoppingCartDrawer({ children }: ShoppingCartProps) {
  const { items, itemCount, updateItemQuantity, removeItem, clearCart, cartTotal } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full w-full sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2">
            Your Cart <span className="text-gray-500 font-normal text-sm">({itemCount} items)</span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 text-center mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <SheetClose asChild>
              <Button>Start Shopping</Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  updateQuantity={updateItemQuantity}
                  removeItem={removeItem}
                />
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-auto space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <div className="text-right">
                    <span className="font-medium">{getInrFromUsd(cartTotal()).formatted}</span>
                    <div className="text-xs text-gray-500">{formatUsd(cartTotal())}</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <div className="text-right">
                    {cartTotal() > 100 ? (
                      <span className="font-medium">Free</span>
                    ) : (
                      <>
                        <span className="font-medium">{getInrFromUsd(10).formatted}</span>
                        <div className="text-xs text-gray-500">$10.00</div>
                      </>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <div className="text-right">
                    <span>{getInrFromUsd(cartTotal() + (cartTotal() > 100 ? 0 : 10)).formatted}</span>
                    <div className="text-xs text-gray-500">{formatUsd(cartTotal() + (cartTotal() > 100 ? 0 : 10))}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </SheetClose>
                
                <SheetClose asChild>
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

interface CartItemCardProps {
  item: CartItem;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
}

function CartItemCard({ item, updateQuantity, removeItem }: CartItemCardProps) {
  const handleQuantityChange = (quantity: number) => {
    updateQuantity(item.id, quantity);
  };

  const itemPrice = parseFloat(item.price.toString());
  const totalPrice = itemPrice * item.quantity;

  return (
    <div className="flex border-b border-gray-200 pb-4">
      <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <h4 className="font-medium text-gray-800">{item.name}</h4>
          <button 
            onClick={() => removeItem(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mb-2">{item.category}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center border border-gray-200 rounded">
            <button 
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="px-2 py-1 text-sm">{item.quantity}</span>
            <button 
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="px-2 py-1 text-gray-500 hover:text-gray-700"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="text-right">
            <p className="font-bold text-gray-800">
              {getInrFromUsd(totalPrice).formatted}
            </p>
            <p className="text-xs text-gray-500">{formatUsd(totalPrice)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
