export type ApiResponseRate = {
  date: string;
  base: CurrencyCode;
  quote: CurrencyCode;
  rate: number;
};

export type SanitizedRate = Omit<ApiResponseRate, "rate"> & {
  rate: string;
};
