export type TimeScaleOption = {
  startDate: string;
};

export const timeScaleOptions: Record<string, TimeScaleOption> = {
  "1D": {
    startDate: getRelativeDate(5),
  },
  "1W": {
    startDate: getRelativeDate(7),
  },
  "1M": {
    startDate: getRelativeDate(30),
  },
  "3M": {
    startDate: getRelativeDate(30 * 3),
  },
  "1Y": {
    startDate: getRelativeDate(365),
  },
  "5Y": {
    startDate: getRelativeDate(365 * 5),
  },
};

export type TimeScaleCode = keyof typeof timeScaleOptions;
