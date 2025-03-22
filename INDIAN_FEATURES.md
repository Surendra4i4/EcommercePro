# Indian Currency and Payment Features

This document highlights the key code snippets related to the Indian currency display and payment methods implemented in the e-commerce application.

## Currency Conversion Utilities

The currency conversion functionality is implemented in `client/src/lib/currency.ts`:

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

## Shopping Cart Implementation

The shopping cart displays prices in INR with USD reference:

```jsx
// From client/src/components/shopping-cart.tsx
<div className="text-right">
  <p className="font-bold text-gray-800">
    {getInrFromUsd(totalPrice).formatted}
  </p>
  <p className="text-xs text-gray-500">{formatUsd(totalPrice)}</p>
</div>
```

## Product Card Implementation

Each product card displays the price in INR with USD reference:

```jsx
// From ProductCard component
<div className="flex items-center justify-between">
  <div>
    <p className="font-bold text-lg">
      {getInrFromUsd(product.price).formatted}
    </p>
    <p className="text-xs text-gray-500">
      {formatUsd(product.price)}
    </p>
  </div>
  <Button 
    variant="outline" 
    size="icon" 
    onClick={() => addToCart(product)}
  >
    <ShoppingCart className="h-4 w-4" />
  </Button>
</div>
```

## Checkout Form with Indian Payment Options

The checkout form includes Indian payment methods:

```jsx
// From client/src/components/checkout-form.tsx
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

## Checkout Order Summary

The order summary in the checkout form displays prices in INR with USD reference:

```jsx
// Order item in checkout summary
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

// Subtotal in checkout summary
<div className="flex justify-between text-gray-600">
  <span>Subtotal</span>
  <div className="text-right">
    <span>{getInrFromUsd(subtotal).formatted}</span>
    <div className="text-xs text-gray-500">{formatUsd(subtotal)}</div>
  </div>
</div>

// Total in checkout summary
<div className="flex justify-between text-lg font-bold">
  <span>Total</span>
  <div className="text-right">
    <span>{getInrFromUsd(total).formatted}</span>
    <div className="text-xs text-gray-500">{formatUsd(total)}</div>
  </div>
</div>
```

## Next Steps for Indian Payment Integration

For full implementation with actual Indian payment gateways, the following would be required:

1. **PhonePe Integration**:
   - Register for a PhonePe merchant account
   - Obtain API keys and integrate their SDK
   - Implement server-side payment verification

2. **Google Pay Integration**:
   - Set up Google Pay for Business
   - Implement the Google Pay API
   - Handle payment callbacks and verification

3. **Paytm Integration**:
   - Register as a Paytm merchant
   - Implement Paytm's payment gateway
   - Set up webhook for payment notifications

The current implementation includes the UI components for these payment methods. The actual integration with the payment gateways would require API keys and additional server-side code.