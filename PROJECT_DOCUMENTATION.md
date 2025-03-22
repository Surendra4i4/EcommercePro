# E-Commerce Platform with Indian Features
## Complete Project Documentation

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technical Architecture](#technical-architecture)
4. [Setup Instructions](#setup-instructions)
5. [Key Components](#key-components)
6. [Indian Features Implementation](#indian-features-implementation)
7. [Code Samples](#code-samples)
8. [Future Enhancements](#future-enhancements)

---

## Project Overview

This e-commerce platform provides a complete shopping experience with product browsing, cart management, user authentication, and checkout processes. The application is specifically tailored for the Indian market with INR currency display and Indian payment methods.

---

## Features

### Core Features
- User registration and authentication
- Product browsing with categories and filters
- Shopping cart functionality
- Multi-step checkout process
- Order management

### Indian Market Features
- Price display in INR with USD reference
- Support for Indian payment methods:
  - PhonePe
  - Google Pay
  - Paytm
- INR currency formatting (₹) according to Indian standards

---

## Technical Architecture

### Frontend
- **React.js**: UI components and state management
- **TanStack Query**: Data fetching and cache management
- **Tailwind CSS**: Styling with Shadcn UI components
- **Wouter**: Lightweight routing solution
- **React Hook Form**: Form handling and validation

### Backend
- **Node.js/Express**: API server and middleware
- **Passport.js**: Authentication
- **In-memory storage**: Data persistence (can be extended to PostgreSQL)
- **TypeScript**: Type safety throughout the application

### State Management
- **React Context API**: For auth and cart state
- **localStorage**: For persisting cart data

---

## Setup Instructions

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open your browser and navigate to http://localhost:5000

---

## Key Components

### Authentication System
- Session-based authentication with Passport.js
- Login and registration forms
- Protected routes for authenticated users

### Product Catalog
- Product grid with filtering and sorting
- Product cards with images, descriptions, and prices in INR

### Shopping Cart
- Add/remove products
- Adjust quantities
- Persistent cart using localStorage

### Checkout Process
- Multi-step form (shipping and payment)
- Order summary with INR prices
- Multiple payment options including Indian payment methods

---

## Indian Features Implementation

### Currency Conversion

The application uses utility functions in `client/src/lib/currency.ts` to convert USD to INR and format currency values:

```typescript
/**
 * Convert USD to INR
 * @param usdAmount - Amount in USD (can be string or number)
 * @returns Amount in INR as a number
 */
export function usdToInr(usdAmount: string | number): number {
  // Convert to number if it's a string
  const amount = typeof usdAmount === 'string' ? parseFloat(usdAmount) : usdAmount;
  
  // Using a fixed exchange rate: 1 USD = 75 INR
  // In a production app, this would come from an API
  const exchangeRate = 75;
  
  return amount * exchangeRate;
}

/**
 * Format currency in INR with ₹ symbol
 * @param amount - Amount to format
 * @returns Formatted INR amount as string
 */
export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format currency in USD with $ symbol
 * @param amount - Amount to format
 * @returns Formatted USD amount as string
 */
export function formatUsd(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numAmount);
}

/**
 * Get INR amount and formatted string from USD amount
 * @param usdAmount - Amount in USD
 * @returns Object with amount in INR and formatted INR string
 */
export function getInrFromUsd(usdAmount: string | number): { amount: number; formatted: string } {
  const inrAmount = usdToInr(usdAmount);
  return {
    amount: inrAmount,
    formatted: formatInr(inrAmount),
  };
}
```

### Indian Payment Methods

The checkout form includes Indian payment options with custom SVG icons:

```jsx
<RadioGroup 
  defaultValue="card" 
  {...register("paymentMethod", { required: "Payment method is required" })}
>
  {/* Credit/Debit Card */}
  <div className="flex items-center space-x-2 border p-4 rounded-lg">
    <RadioGroupItem value="card" id="card" disabled={createOrderMutation.isPending} />
    <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
      <span>Credit/Debit Card</span>
    </Label>
  </div>
  
  {/* PhonePe */}
  <div className="flex items-center space-x-2 border p-4 rounded-lg">
    <RadioGroupItem value="phonepe" id="phonepe" disabled={createOrderMutation.isPending} />
    <Label htmlFor="phonepe" className="flex items-center space-x-2 cursor-pointer">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12Z" stroke="currentColor"/>
        <path d="M14.8332 9.77392C14.7279 9.76551 14.622 9.76136 14.516 9.76136C13.3466 9.76136 12.367 10.5239 11.8082 11.6681C11.4094 11.014 10.8224 10.5282 10.0745 10.4043C9.58309 10.3216 8.9395 10.3747 8.39226 10.6851V15.3341H10.0745V12.3568C10.0745 11.9205 10.4324 11.5625 10.8686 11.5625C11.305 11.5625 11.6631 11.9205 11.6631 12.3568V15.3341H13.3447V12.3568C13.3447 11.9205 13.7034 11.5625 14.1396 11.5625C14.5757 11.5625 14.9332 11.9205 14.9332 12.3568V15.3341H16.6155V11.8747C16.6155 10.8736 15.8337 9.83239 14.8332 9.77392Z" fill="currentColor"/>
        <path d="M7.59517 9.59375C8.03139 9.59375 8.38517 9.23997 8.38517 8.80375C8.38517 8.36753 8.03139 8.01375 7.59517 8.01375C7.15895 8.01375 6.80517 8.36753 6.80517 8.80375C6.80517 9.23997 7.15895 9.59375 7.59517 9.59375Z" fill="currentColor"/>
        <path d="M8.38462 15.3337V10.4037H6.80469V15.3337H8.38462Z" fill="currentColor"/>
      </svg>
      <span>PhonePe</span>
    </Label>
  </div>
  
  {/* Google Pay */}
  <div className="flex items-center space-x-2 border p-4 rounded-lg">
    <RadioGroupItem value="googlepay" id="googlepay" disabled={createOrderMutation.isPending} />
    <Label htmlFor="googlepay" className="flex items-center space-x-2 cursor-pointer">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor"/>
        <path d="M15.5 8.5H14.5L12 14.5L9.5 8.5H8.5L11.5 15.5H12.5L15.5 8.5Z" fill="currentColor"/>
      </svg>
      <span>Google Pay</span>
    </Label>
  </div>
  
  {/* Paytm */}
  <div className="flex items-center space-x-2 border p-4 rounded-lg">
    <RadioGroupItem value="paytm" id="paytm" disabled={createOrderMutation.isPending} />
    <Label htmlFor="paytm" className="flex items-center space-x-2 cursor-pointer">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.75 3H5.25C3.59315 3 2.25 4.34315 2.25 6V18C2.25 19.6569 3.59315 21 5.25 21H18.75C20.4069 21 21.75 19.6569 21.75 18V6C21.75 4.34315 20.4069 3 18.75 3Z" stroke="currentColor"/>
        <path d="M7 9.5V14.5H9V12H10.5V14.5H12.5V9.5H10.5V11H9V9.5H7Z" fill="currentColor"/>
        <path d="M15 9.5H13V14.5H15C16.3807 14.5 17.5 13.3807 17.5 12C17.5 10.6193 16.3807 9.5 15 9.5Z" fill="currentColor"/>
      </svg>
      <span>Paytm</span>
    </Label>
  </div>
</RadioGroup>
```

---

## Code Samples

### Authentication Context (client/src/hooks/use-auth.tsx)

```jsx
import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

### Shopping Cart Context (client/src/hooks/use-cart.tsx)

```jsx
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Product } from "@shared/schema";

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
  
  // Load items from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }, []);
  
  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems(currentItems => {
      // Check if item already exists in cart
      const existingItemIndex = currentItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const newItems = [...currentItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Add new item
        return [...currentItems, { ...product, quantity }];
      }
    });
  };
  
  const updateItemQuantity = (id: number, quantity: number) => {
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0)
    );
  };
  
  const removeItem = (id: number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };
  
  const clearCart = () => {
    setItems([]);
  };
  
  const cartTotal = () => {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.price.toString()) * item.quantity);
    }, 0);
  };
  
  return (
    <CartContext.Provider value={{
      items,
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      addItem,
      updateItemQuantity,
      removeItem,
      clearCart,
      cartTotal
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
```

### Shopping Cart Component (client/src/components/shopping-cart.tsx)

```jsx
import { useState } from "react";
import { useCart, CartItem } from "@/hooks/use-cart";
import { getInrFromUsd, formatUsd } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Trash, Plus, Minus } from "lucide-react";
import { useLocation } from "wouter";

interface ShoppingCartProps {
  children: React.ReactNode;
}

export function ShoppingCartDrawer({ children }: ShoppingCartProps) {
  const [open, setOpen] = useState(false);
  const { items, itemCount } = useCart();
  
  return (
    <>
      <div className="relative inline-block" onClick={() => setOpen(true)}>
        {children}
        {itemCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {itemCount}
          </div>
        )}
      </div>
      
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </DrawerTitle>
          </DrawerHeader>
          
          {items.length === 0 ? (
            <div className="p-6 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Your cart is empty</h3>
              <p className="mt-1 text-gray-500">Add items to get started</p>
              <Button 
                className="mt-6" 
                onClick={() => setOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {items.map((item) => (
                    <CartItemCard 
                      key={item.id}
                      item={item}
                      updateQuantity={(id, quantity) => useCart().updateItemQuantity(id, quantity)}
                      removeItem={(id) => useCart().removeItem(id)}
                    />
                  ))}
                </div>
              </div>
              
              <CartSummary setOpen={setOpen} />
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

interface CartItemCardProps {
  item: CartItem;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
}

function CartItemCard({ item, updateQuantity, removeItem }: CartItemCardProps) {
  return (
    <div className="flex gap-4">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
        <img 
          src={item.image} 
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium">
          <h3 className="line-clamp-1">{item.name}</h3>
          <div className="text-right">
            <p className="font-bold text-gray-800">
              {getInrFromUsd(parseFloat(item.price.toString()) * item.quantity).formatted}
            </p>
            <p className="text-xs text-gray-500">{formatUsd(parseFloat(item.price.toString()) * item.quantity)}</p>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500 line-clamp-1">{item.category}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center border rounded-md">
            <button 
              className="p-2"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="px-2 min-w-8 text-center">{item.quantity}</span>
            <button 
              className="p-2"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus size={16} />
            </button>
          </div>
          
          <button 
            className="text-red-500 hover:text-red-700"
            onClick={() => removeItem(item.id)}
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CartSummary({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { cartTotal, items } = useCart();
  const [, navigate] = useLocation();
  
  const totalPrice = cartTotal();
  
  const handleCheckout = () => {
    navigate('/checkout');
    setOpen(false);
  };
  
  return (
    <DrawerFooter className="border-t px-6 py-4">
      <div className="space-y-3">
        <div className="flex justify-between text-base font-medium">
          <p>Subtotal</p>
          <div className="text-right">
            <p className="font-bold text-gray-800">
              {getInrFromUsd(totalPrice).formatted}
            </p>
            <p className="text-xs text-gray-500">{formatUsd(totalPrice)}</p>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>
        <Separator />
        <Button 
          className="w-full" 
          onClick={handleCheckout}
        >
          Checkout
        </Button>
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={() => setOpen(false)}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </DrawerFooter>
  );
}
```

### Checkout Form (client/src/components/checkout-form.tsx)

```jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getInrFromUsd, formatUsd } from "@/lib/currency";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  paymentMethod: string;
}

export function CheckoutForm() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"shipping" | "payment">("shipping");

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CheckoutFormData>({
    defaultValues: {
      email: user?.email || "",
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ")[1] || "",
      paymentMethod: "card"
    }
  });

  const createOrderMutation = useMutation({
    mutationFn: async (formData: CheckoutFormData) => {
      // Calculate totals
      const subtotal = cartTotal();
      const shipping = subtotal > 100 ? 0 : 10;
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;

      // Create order items from cart
      const orderItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      // Create order
      const orderData = {
        status: "Processing",
        total: total.toString(),
        items: orderItems
      };

      const res = await apiRequest("POST", "/api/orders", orderData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Placed!",
        description: "Your order has been placed successfully.",
      });
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to place order: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: CheckoutFormData) => {
    if (step === "shipping") {
      setStep("payment");
    } else {
      createOrderMutation.mutate(data);
    }
  };

  if (items.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your cart is empty</CardTitle>
          <CardDescription>Add some products to proceed with checkout</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => setLocation("/")}>Continue Shopping</Button>
        </CardFooter>
      </Card>
    );
  }

  // Calculate totals
  const subtotal = cartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card className={step === "payment" ? "opacity-70" : ""}>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Enter your shipping details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Form fields for shipping information */}
                {/* ... (form fields for name, address, etc.) */}
              </CardContent>
              {step === "shipping" && (
                <CardFooter>
                  <Button type="submit" className="ml-auto">
                    Continue to Payment
                  </Button>
                </CardFooter>
              )}
            </Card>

            {/* Payment Information */}
            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Select your preferred payment method</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup 
                    defaultValue="card" 
                    {...register("paymentMethod", { required: "Payment method is required" })}
                  >
                    {/* Credit/Debit Card */}
                    <div className="flex items-center space-x-2 border p-4 rounded-lg">
                      <RadioGroupItem value="card" id="card" disabled={createOrderMutation.isPending} />
                      <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                          <line x1="1" y1="10" x2="23" y2="10"></line>
                        </svg>
                        <span>Credit/Debit Card</span>
                      </Label>
                    </div>
                    
                    {/* PhonePe */}
                    <div className="flex items-center space-x-2 border p-4 rounded-lg">
                      <RadioGroupItem value="phonepe" id="phonepe" disabled={createOrderMutation.isPending} />
                      <Label htmlFor="phonepe" className="flex items-center space-x-2 cursor-pointer">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12Z" stroke="currentColor"/>
                          <path d="M14.8332 9.77392C14.7279 9.76551 14.622 9.76136 14.516 9.76136C13.3466 9.76136 12.367 10.5239 11.8082 11.6681C11.4094 11.014 10.8224 10.5282 10.0745 10.4043C9.58309 10.3216 8.9395 10.3747 8.39226 10.6851V15.3341H10.0745V12.3568C10.0745 11.9205 10.4324 11.5625 10.8686 11.5625C11.305 11.5625 11.6631 11.9205 11.6631 12.3568V15.3341H13.3447V12.3568C13.3447 11.9205 13.7034 11.5625 14.1396 11.5625C14.5757 11.5625 14.9332 11.9205 14.9332 12.3568V15.3341H16.6155V11.8747C16.6155 10.8736 15.8337 9.83239 14.8332 9.77392Z" fill="currentColor"/>
                          <path d="M7.59517 9.59375C8.03139 9.59375 8.38517 9.23997 8.38517 8.80375C8.38517 8.36753 8.03139 8.01375 7.59517 8.01375C7.15895 8.01375 6.80517 8.36753 6.80517 8.80375C6.80517 9.23997 7.15895 9.59375 7.59517 9.59375Z" fill="currentColor"/>
                          <path d="M8.38462 15.3337V10.4037H6.80469V15.3337H8.38462Z" fill="currentColor"/>
                        </svg>
                        <span>PhonePe</span>
                      </Label>
                    </div>
                    
                    {/* Google Pay */}
                    <div className="flex items-center space-x-2 border p-4 rounded-lg">
                      <RadioGroupItem value="googlepay" id="googlepay" disabled={createOrderMutation.isPending} />
                      <Label htmlFor="googlepay" className="flex items-center space-x-2 cursor-pointer">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor"/>
                          <path d="M15.5 8.5H14.5L12 14.5L9.5 8.5H8.5L11.5 15.5H12.5L15.5 8.5Z" fill="currentColor"/>
                        </svg>
                        <span>Google Pay</span>
                      </Label>
                    </div>
                    
                    {/* Paytm */}
                    <div className="flex items-center space-x-2 border p-4 rounded-lg">
                      <RadioGroupItem value="paytm" id="paytm" disabled={createOrderMutation.isPending} />
                      <Label htmlFor="paytm" className="flex items-center space-x-2 cursor-pointer">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.75 3H5.25C3.59315 3 2.25 4.34315 2.25 6V18C2.25 19.6569 3.59315 21 5.25 21H18.75C20.4069 21 21.75 19.6569 21.75 18V6C21.75 4.34315 20.4069 3 18.75 3Z" stroke="currentColor"/>
                          <path d="M7 9.5V14.5H9V12H10.5V14.5H12.5V9.5H10.5V11H9V9.5H7Z" fill="currentColor"/>
                          <path d="M15 9.5H13V14.5H15C16.3807 14.5 17.5 13.3807 17.5 12C17.5 10.6193 16.3807 9.5 15 9.5Z" fill="currentColor"/>
                        </svg>
                        <span>Paytm</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Card information fields when card payment method is selected */}
                  {watch("paymentMethod") === "card" && (
                    <>
                      {/* ... (card input fields) */}
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b">
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-800 line-clamp-1">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="font-medium">
                          {getInrFromUsd(parseFloat(item.price.toString()) * item.quantity).formatted}
                          <span className="text-xs text-gray-500 ml-1">
                            ({formatUsd(parseFloat(item.price.toString()) * item.quantity)})
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <div className="text-right">
                      <span>{getInrFromUsd(subtotal).formatted}</span>
                      <div className="text-xs text-gray-500">{formatUsd(subtotal)}</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <div className="text-right">
                      {shipping === 0 ? (
                        <span>Free</span>
                      ) : (
                        <>
                          <span>{getInrFromUsd(shipping).formatted}</span>
                          <div className="text-xs text-gray-500">{formatUsd(shipping)}</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <div className="text-right">
                      <span>{getInrFromUsd(tax).formatted}</span>
                      <div className="text-xs text-gray-500">{formatUsd(tax)}</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <div className="text-right">
                      <span>{getInrFromUsd(total).formatted}</span>
                      <div className="text-xs text-gray-500">{formatUsd(total)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              {step === "payment" && (
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      "Complete Order"
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setStep("shipping")}
                    disabled={createOrderMutation.isPending}
                  >
                    Back to Shipping
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
```

---

## Future Enhancements

1. **Integration with Real Payment Gateways**
   - Connect with PhonePe, Google Pay, and Paytm APIs
   - Implement payment verification and callbacks

2. **Advanced User Features**
   - User profiles and addresses
   - Order history and tracking
   - Wishlist functionality

3. **Product Enhancements**
   - Product reviews and ratings
   - Related products recommendations
   - Advanced filtering and search

4. **Administrative Features**
   - Admin dashboard for product management
   - Order processing workflows
   - Sales analytics and reporting

5. **Technical Improvements**
   - Move from in-memory storage to a database
   - Implement real-time price conversion API
   - Add more comprehensive testing