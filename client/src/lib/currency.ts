// Currency conversion utility
// Exchange rate: 1 USD = 83.50 INR (approximate fixed rate)
const USD_TO_INR_RATE = 83.50;

/**
 * Convert USD to INR
 * @param usdAmount - Amount in USD (can be string or number)
 * @returns Amount in INR as a number
 */
export function usdToInr(usdAmount: string | number): number {
  const usd = typeof usdAmount === 'string' ? parseFloat(usdAmount) : usdAmount;
  return usd * USD_TO_INR_RATE;
}

/**
 * Format currency in INR with ₹ symbol
 * @param amount - Amount to format
 * @returns Formatted INR amount as string
 */
export function formatInr(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

/**
 * Format currency in USD with $ symbol
 * @param amount - Amount to format
 * @returns Formatted USD amount as string
 */
export function formatUsd(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `$${numAmount.toFixed(2)}`;
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
    formatted: formatInr(inrAmount)
  };
}