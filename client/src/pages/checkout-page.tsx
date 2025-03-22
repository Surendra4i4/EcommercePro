import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CheckoutForm } from "@/components/checkout-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";

export default function CheckoutPage() {
  const { items } = useCart();
  const [, setLocation] = useLocation();
  const [checkoutStep, setCheckoutStep] = useState<"checkout" | "success">("checkout");

  // Go back to home if cart is empty and not in success state
  const handleBackToShopping = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-500"
              onClick={handleBackToShopping}
            >
              <ArrowLeft className="h-4 w-4" /> Back to Shopping
            </Button>
          </div>
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600">
              {checkoutStep === "checkout" 
                ? "Complete your order by providing your shipping and payment details." 
                : "Your order has been placed successfully!"}
            </p>
          </div>
          
          {checkoutStep === "checkout" ? (
            items.length > 0 ? (
              <CheckoutForm />
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400 mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Button onClick={handleBackToShopping}>Continue Shopping</Button>
              </div>
            )
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="bg-green-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Thank you for your purchase. Your order has been processed successfully.
                You'll receive a confirmation email shortly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleBackToShopping}>Continue Shopping</Button>
                <Button variant="outline" onClick={() => setLocation("/orders")}>
                  View Orders
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
