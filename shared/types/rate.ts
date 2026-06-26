export type Rate = {
  date: string;
  base: CurrencyCode;
  quote: CurrencyCode;
  rate: number | undefined;
};
