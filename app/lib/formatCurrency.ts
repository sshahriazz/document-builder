export function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch {
    // fallback if currency code invalid
    return amount.toFixed(2) + ' ' + currency;
  }
}
