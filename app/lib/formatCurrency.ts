import type { CurrencyCode } from "@/app/types/currency";

export function formatCurrency(amount: number, currency: CurrencyCode) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch {
    // fallback if currency code invalid
    return amount.toFixed(2) + ' ' + String(currency);
  }
}
