export type Conversion = {
  datetime: string | number | Date;
  base: CurrencyCode;
  quote: CurrencyCode;
  rate: number;
  send: number;
  receive: number;
};
