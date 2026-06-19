export type Conversion = {
  datetime: string | number | Date;
  base: string;
  quote: string;
  rate: number;
  send: number;
  receive: number;
};
