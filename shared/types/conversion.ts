export type Conversion = {
  id: string;
  datetime: string | number | Date;
  sendCurrency: CurrencyCode;
  receiveCurrency: CurrencyCode;
  sendAmount: string;
  receiveAmount: string;
  exchangeRate: string;
};
