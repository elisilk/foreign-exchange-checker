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
