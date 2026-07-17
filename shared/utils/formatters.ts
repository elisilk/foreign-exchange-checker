import type { Big } from "big.js";

export function formatExchangeRate(rateBig: Big, locale = "en-US"): string {
  const rateFloat = Number.parseFloat(rateBig.toString());

  const significantDigits = rateFloat < 1 ? 4 : 5;

  return new Intl.NumberFormat(
    locale,
    {
      style: "decimal",
      minimumSignificantDigits: significantDigits,
      maximumSignificantDigits: significantDigits,
    },
  ).format(rateFloat);
}

export function formatCurrency(amount: string | number, currencyCode: CurrencyCode = "EUR", locale = "en-US"): string {
  const numericValue = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  if (Number.isNaN(numericValue))
    return "";

  // 1. Find how many decimals this currency naturally uses
  const formatterWithSymbol = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  });

  const resolvedOptions = formatterWithSymbol.resolvedOptions();
  const fractionDigits = resolvedOptions.maximumFractionDigits;

  // 2. Format as a standard decimal, forcing the exact fraction count
  return new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(numericValue);
}

export function getCurrencyPrecision(currency: CurrencyCode, locale = "en-US"): number {
  try {
    const formatter = new Intl.NumberFormat(
      locale,
      { style: "currency", currency },
    );
    return formatter.resolvedOptions().maximumFractionDigits ?? 2;
  }
  catch {
    return 2;
  }
}

export const integerFormatter = new Intl.NumberFormat(
  "en-US",
  {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
);

export const decimalFormatter = new Intl.NumberFormat(
  "en-US",
  {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
);

export const dateFormatter = new Intl.DateTimeFormat(
  "en-US",
  {
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  },
);

export const dateTimeFormatter = new Intl.DateTimeFormat(
  "en-US",
  {
    dateStyle: "medium",
    timeStyle: "long",
  },
);
