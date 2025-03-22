import { Link, useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart as CartIcon, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SheetClose, SheetTitle } from "@/components/ui/sheet";
import CartItem from "./CartItem";
import { useAuth } from "@/hooks/use-auth";

export default function ShoppingCart() {
  const { cartItems, cartTotal, clearCart, isLoading } = useCart();
  const { user } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between py-4">
          <SheetTitle>Shopping cart</SheetTitle>
          <SheetClose className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </SheetClose>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <p className="text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between py-4">
          <SheetTitle>Shopping cart</SheetTitle>
          <SheetClose className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </SheetClose>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center gap-4">
          <CartIcon className="h-16 w-16 text-gray-300" />
          <p className="text-gray-500">Please log in to view your cart</p>
          <SheetClose asChild>
            <Link href="/auth">
              <Button>Log In</Button>
            </Link>
          </SheetClose>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between py-4">
          <SheetTitle>Shopping cart</SheetTitle>
          <SheetClose className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </SheetClose>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center gap-4">
          <CartIcon className="h-16 w-16 text-gray-300" />
          <p className="text-gray-500">Your cart is empty</p>
          <SheetClose asChild>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </SheetClose>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between py-4">
        <SheetTitle>Shopping cart</SheetTitle>
        <SheetClose className="rounded-full p-1 hover:bg-gray-100">
          <X className="h-4 w-4" />
        </SheetClose>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="flow-root">
          <ul role="list" className="-my-6 divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.id}>
                <CartItem item={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 py-6">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>${cartTotal.toFixed(2)}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
        
        <div className="mt-6">
          <SheetClose asChild>
            <Link href="/checkout">
              <Button className="w-full justify-center">
                Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </SheetClose>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button 
            onClick={() => clearCart()} 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:text-red-800 hover:bg-red-50"
          >
            Clear Cart
          </Button>
          
          <SheetClose asChild>
            <Link href="/">
              <Button variant="outline" size="sm">
                Continue Shopping
              </Button>
            </Link>
          </SheetClose>
        </div>
      </div>
    </div>
  );
}
