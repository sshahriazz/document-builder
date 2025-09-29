export const CURRENCY_CODES = [
  'USD','EUR','GBP','JPY','AUD','CAD','CNY','INR','NZD','CHF','SEK','NOK','DKK','HKD','SGD','KRW','MXN','BRL','ZAR'
] as const;

export type CurrencyCode = typeof CURRENCY_CODES[number];
