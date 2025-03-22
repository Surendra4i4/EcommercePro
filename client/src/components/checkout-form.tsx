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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...register("firstName", { required: "First name is required" })}
                      disabled={step === "payment" || createOrderMutation.isPending}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...register("lastName", { required: "Last name is required" })}
                      disabled={step === "payment" || createOrderMutation.isPending}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    disabled={step === "payment" || createOrderMutation.isPending}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    {...register("address", { required: "Address is required" })}
                    disabled={step === "payment" || createOrderMutation.isPending}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-6 gap-4">
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...register("city", { required: "City is required" })}
                      disabled={step === "payment" || createOrderMutation.isPending}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city.message}</p>
                    )}
                  </div>
                  <div className="col-span-1 space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      {...register("state", { required: "State is required" })}
                      disabled={step === "payment" || createOrderMutation.isPending}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-500">{errors.state.message}</p>
                    )}
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      {...register("zipCode", { required: "ZIP code is required" })}
                      disabled={step === "payment" || createOrderMutation.isPending}
                    />
                    {errors.zipCode && (
                      <p className="text-sm text-red-500">{errors.zipCode.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone", { required: "Phone is required" })}
                    disabled={step === "payment" || createOrderMutation.isPending}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
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

                  {watch("paymentMethod") === "card" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          disabled={createOrderMutation.isPending}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            disabled={createOrderMutation.isPending}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            disabled={createOrderMutation.isPending}
                          />
                        </div>
                      </div>
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
